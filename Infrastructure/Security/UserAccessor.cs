using System.Security.Claims;
using Application.Interface;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

        }

        // get user token
        public string GetUsername()
        {
            return _httpContextAccessor.HttpContext.User?.FindFirstValue(ClaimTypes.Name);
        }
    }
}