using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser) // Include the Attendees and the AppUser properties
                    .SingleOrDefaultAsync(x => x.Id == request.Id); // SingleOrDefaultAsync returns null if no match is found in the database 

                if (activity == null) return null;

                var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername()); // Get the current user

                if (currentUser == null) return null;

                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName; // Get the host username from the activity

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == currentUser.UserName); // Get the attendance record for the current user

                if (attendance != null && hostUsername == currentUser.UserName) // If the current user is the host and they are cancelling the activity
                {
                    activity.IsCancelled = !activity.IsCancelled; // Toggle the IsCancelled property
                }

                if (attendance != null && hostUsername != currentUser.UserName) // If the current user is not the host and they are cancelling their attendance
                {
                    activity.Attendees.Remove(attendance); // Remove the attendance record
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        // Create a new attendance record
                        AppUser = currentUser,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance); // Add the attendance record to the activity
                }

                var result = await _context.SaveChangesAsync() > 0; // Save the changes to the database

                return result ? Result<Unit>.Success(Unit.Value) :
                        Result<Unit>.Failure("Problem updating attendance"); // Return a success or failure message depending on the result of the save changes operation
            }

        }
    }
}