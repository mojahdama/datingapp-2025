using System.Net.WebSockets;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return members;
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMembers(string id)
        {
            var members = await context.Users.FindAsync(id);
            if (members == null) return NotFound();

            return members;
        }

    }
}