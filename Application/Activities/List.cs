using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationtoken)
            {
                var activities = await _context.Activities
                    // .Include(a => a.Attendees)
                    // .ThenInclude(u => u.AppUser)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider) // This is the line that maps the Activity to ActivityDto
                    .ToListAsync(cancellationtoken);

                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities); // This is the line that maps the Activity to ActivityDto

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}