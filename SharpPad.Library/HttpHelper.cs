using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SharpPad
{
    internal class HttpHelper
    {
        public static HttpClient Client { get; private set; } = new HttpClient();
    }
}
