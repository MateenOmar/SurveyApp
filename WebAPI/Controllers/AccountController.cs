using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;
using AutoMapper;
using Azure;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public AccountController(IUnitOfWork uow, IConfiguration configuration, IMapper mapper)
        {
            this.uow = uow;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        // POST api/account/login -- Authenticate user
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginReqDto loginReq){
            var user = await uow.UserRepository.Authenticate(loginReq.userName, loginReq.password);

            // var apiError = new ApiError();

            // if(user == null) {
            //     apiError.ErrorCode = Unauthorized().StatusCode;
            //     apiError.ErrorMessage = "Invalid User ID or Password";
            //     apiError.ErrorDetails = "This error appears when provided user id or password does not exits";
            //     return Unauthorized(apiError);
            // }

            var loginRes = new LoginResDto();
            loginRes.userName = user.userName;
            loginRes.token = CreateJWT(user);
            loginRes.admin = user.admin;

            return Ok(loginRes);
        }

        // Create JWT token
        private string CreateJWT(User user) {
            var secretKey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var claims = new Claim[] {
                new Claim(ClaimTypes.Name,user.userName),
                new Claim(ClaimTypes.NameIdentifier,user.userID.ToString())
            };

            var signingCredentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(1000),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        // POST api/account/register -- Register user
        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> Register(RegisterReqDto registerReq){
            // ApiError apiError = new ApiError();

            // if(loginReq.userName.IsEmpty() || loginReq.password.IsEmpty()) {
            //         apiError.ErrorCode=BadRequest().StatusCode;
            //         apiError.ErrorMessage="User name or password can not be blank";                    
            //         return BadRequest(apiError);
            // }  

            // if (await uow.UserRepository.UserAlreadyExists(loginReq.userName)) {
            //     apiError.ErrorCode = BadRequest().StatusCode;
            //     apiError.ErrorMessage = "User already exists.";
            //     return BadRequest(apiError);
            // }
            
            uow.UserRepository.Register(registerReq.userName, registerReq.password, registerReq.firstName, registerReq.lastName, registerReq.email);
            await uow.SaveAsync();

            return StatusCode(201);
        }

        // GET api/account/users -- Get all users
        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetUsers() {
            var users = await uow.UserRepository.GetUsersAsync();
            var usersDto = mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(usersDto);
        }

        // GET api/account/users/{userName} -- Get user by userName
        [HttpGet("users/{userName}")]
        [Authorize]
        public async Task<IActionResult> GetUser(string userName) {
            var user = await uow.UserRepository.GetUserAsync(userName);
            var userDto =  mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        // DELETE api/account/users/delete/{userName} -- Delete user by userName
        [HttpDelete("users/delete/{userName}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string userName) {
            uow.UserRepository.DeleteUser(userName);
            await uow.SaveAsync();
            return StatusCode(200);
        }

        // PATCH api/account/users/update/{userName} -- Update user by userName
        [HttpPatch("users/update/{userName}")]
        [Authorize]
        public async Task<IActionResult> UpdateUserPatch(string userName, JsonPatchDocument<User> userToPatch) {
            var userFromDB = await uow.UserRepository.GetUserAsync(userName);
            userToPatch.ApplyTo(userFromDB, ModelState);
            await uow.SaveAsync();
            return StatusCode(200);
        }
    }
}