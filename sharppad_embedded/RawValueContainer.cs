using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SharpPad
{
    public class RawValueContainer
    {
        [JsonProperty("$value")]
        private object _raw;

        [JsonProperty("$type")]
        private string _type;

        public RawValueContainer(object raw)
        {
            _raw = raw;
            _type = GetGenericTypeName(raw.GetType());
        }

        private static string GetGenericTypeName(Type target)
        {
            if (target.IsGenericType && target.GenericTypeArguments.Length > 0)
            {
                return $"{target.Name.Remove(target.Name.Length - 2)}<{target.GenericTypeArguments[0].Name}>";
            }

            return target.Name;
        }
    }
}
