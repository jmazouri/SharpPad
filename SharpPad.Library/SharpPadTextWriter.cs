using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace SharpPad
{
    public class SharpPadTextWriter : TextWriter
    {
        private string _title = null;

        public override Encoding Encoding => Encoding.UTF8;

        public SharpPadTextWriter(string title)
        {
            _title = title;
        }

        public override void Write(char value)
        {
            Write(value.ToString());
        }

        public override void Write(string value)
        {
            if (!String.IsNullOrWhiteSpace(value))
            {
                Output.DumpInternal(value, _title, false).GetAwaiter().GetResult();
            }
        }

        public override void WriteLine()
        {
            //Newlines are implied
        }
    }
}
