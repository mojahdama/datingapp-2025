
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActiivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController() : ControllerBase
    {
    }
}