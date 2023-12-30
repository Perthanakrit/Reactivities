using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            string userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user id from the token

            if (userId == null) return Task.CompletedTask;

            Guid activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value?.ToString()); // Get the activity id from the route

            ActivityAttendee attendee = _dbContext.ActivityAttendees.AsNoTracking()
                                            .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
                                            .Result; // Get the attendee from the database

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement); // If the user is the host, then succeed

            return Task.CompletedTask;
        }
    }

}