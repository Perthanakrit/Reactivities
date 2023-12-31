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

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; } // Id of the photo in Cloudinary
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(IUserAccessor userAccessor, IPhotoAccessor photoAccessor, DataContext context)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                AppUser user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                Photo photo = user.Photos.FirstOrDefault(x => x.Id == request.Id); // Get the photo from the user's photos
                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain); // Get the current main photo
                if (currentMain != null) currentMain.IsMain = false; // Set the current main photo to false

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}