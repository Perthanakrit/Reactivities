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
                _context = context;
                _userAccessor = userAccessor;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activitiy = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activitiy == null) return null;

                // Get the user from the token
                AppUser user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                string HostUsername = activitiy.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName;

                ActivityAttendee attendance = activitiy.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                // If the user is the host, cancel the activity
                if (attendance != null && HostUsername == user.UserName)
                    activitiy.IsCancelled = !activitiy.IsCancelled;

                // If the user is not the host, add or remove the user from the attendees
                if (attendance != null && HostUsername != user.UserName)
                    activitiy.Attendees.Remove(attendance);

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activitiy,
                        IsHost = false
                    };

                    activitiy.Attendees.Add(attendance);
                }

                bool result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}