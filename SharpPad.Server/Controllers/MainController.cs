using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SharpPad.Server
{
    [Route("~/api")]
    [ApiController]
    public class MainController : ControllerBase
    {
        private readonly InteractiveEngine _engine;

        public MainController(InteractiveEngine engine)
        {
            _engine = engine;
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteCode([FromBody] ExecutionRequest code, CancellationToken cancellationToken)
        {
            try
            {
                await _engine.Execute(code.Code, cancellationToken);
                return Ok(new { result = _engine.LastReturnValue });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reset")]
        public void Reset()
        {
            _engine.ClearState();
        }

        [HttpGet("variableState")]
        public async Task<IActionResult> VariableState()
        {
            var mapped = _engine.Variables.ToDictionary(d => d.Name, d => d.Value);

            return Ok(mapped);
        }
    }
}