using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SharpPad
{
    internal class RawValueContainer
    {
        [JsonProperty("$value")]
        private object _raw;

        public RawValueContainer(object raw)
        {
            _raw = raw;
        }
    }
}
