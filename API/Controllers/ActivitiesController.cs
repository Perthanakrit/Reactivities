using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] // api/activities
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query())); //Mediator = BaseApiController.Mediator()
        }

        [HttpGet("{id}")] //api/activities/dhfflsdh(id)
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //return await _mediator.Activities.FindAsync(id);
            var result = await Mediator.Send(new Details.Query{Id = id}); //Mediator = BaseApiController.

            return HandleResult(result);          
        }
        [HttpPost] //api/activities
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity }));
        }

        [HttpPut("{id}")] //api/activities/id(Guid)
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command {Activity = activity}));
        }

        [HttpDelete("{id}")] //api/activities/
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
        }
    }
}