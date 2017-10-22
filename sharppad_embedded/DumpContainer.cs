using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SharpPad
{
    internal class DumpContainer
    {
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("$value")]
        public object Value { get; set; }
    }
}
