using System;
using System.Threading.Tasks;
using SharpPad;

namespace Template
{
    class Program
    {
        static async Task Main(string[] args)
        {
            await "Hello World!".Dump();
        }
    }
}
