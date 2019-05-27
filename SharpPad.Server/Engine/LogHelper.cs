using Dotnet.Script.DependencyModel.Logging;
using Microsoft.Extensions.Logging;

namespace SharpPad.Server
{
    public static class LogHelper
    {
        public static LogFactory CreateLogFactory(string verbosity)
        {
            var logLevel = (Dotnet.Script.DependencyModel.Logging.LogLevel)LevelMapper.FromString(verbosity);
            
            var loggerFactory = new LoggerFactory();            

            return type =>
            {
                var logger = loggerFactory.CreateLogger(type);
                return (level, message, exception) =>
                {
                    logger.Log((Microsoft.Extensions.Logging.LogLevel)level, message, exception);                   
                };
            };
        }   
    }
}