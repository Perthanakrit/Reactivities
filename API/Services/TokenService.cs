using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                // new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id), // this is the id of the user
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])); // key at least 16 characters long
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature); // create credentials

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), // pass in the claims
                Expires = DateTime.Now.AddDays(7), // token expires in 7 days
                SigningCredentials = creds // pass in the credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler(); // create token handler

            var token = tokenHandler.CreateToken(tokenDescriptor); // create token

            return tokenHandler.WriteToken(token); // return token
        }
    }
}