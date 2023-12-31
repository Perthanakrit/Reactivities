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
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; } // Id of the photo in Cloudinary
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(IPhotoAccessor photoAccessor, IUserAccessor userAccessor, DataContext context)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                AppUser user = await _context.Users.Include(p => p.Photos)
                                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                Photo photo = user.Photos.FirstOrDefault(x => x.Id == request.Id); // Get the photo from the user's photos
                if (photo == null) return null;

                if (photo.IsMain)
                    return Result<Unit>.Failure("You cannot delete your main photo");

                string result = await _photoAccessor.DeletePhoto(photo.Id); // Delete the photo from Cloudinary
                if (result == null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary");

                user.Photos.Remove(photo); // Remove the photo from the user's photos

                bool success = await _context.SaveChangesAsync() > 0;
                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}