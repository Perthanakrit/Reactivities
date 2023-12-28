using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
        // This is a null coalescing assignment operator. It assigns the value of the right-hand operand to the left-hand operand only if the left-hand operand is null.

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();

            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);


            if (result.IsSuccess && result.Value == null)
                return NotFound();

            return BadRequest(result.Error);

        }

    }
}