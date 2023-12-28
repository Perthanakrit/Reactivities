using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }
        public static Result<T> Success(T Value) => new Result<T> { IsSuccess = true, Value = Value };

        /// <summary>
        /// This is a static method that returns a new instance of the Result class when passed an error message.
        /// </summary>
        /// <param name="error"></param>
        /// <returns>Result</returns>
        public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
    }
}