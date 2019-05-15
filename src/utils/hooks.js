// import { useEffect, useState } from 'react';

// export function usePromise(promiseFunc, initialVal, onError) {
//   const [data, setData] = useState(initialVal);
//   const [loading, setLoading] = useState(false);
//   let cancelled = false;

//   useEffect(
//     () => () => {
//       cancelled = true;
//     },
//     []
//   );

//   async function exec(...params) {
//     if (loading) {
//       if (onError) {
//         onError(new Error("usePromise can only be called while it's idle"));
//       }
//       return;
//     }

//     setLoading(true);

//     promiseFunc(...params)
//       .then(result => {
//         if (!cancelled) {
//           setLoading(false);
//           setData(result);
//         }
//       })
//       .catch(error => {
//         if (!cancelled) {
//           setLoading(false);
//           if (onError) {
//             onError(error);
//           }
//         }
//       });
//   }

//   return [data, loading, exec];
// }

import { useState, useEffect } from 'react';

const makeCancelable = function makeCancelable(promise, ...params) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise(...params)
      .then(val => {
        if (!isCanceled) {
          return resolve(val);
        }
        return true;
      })
      .catch(error => (isCanceled ? reject(new Error({ isCanceled })) : reject(error)));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
};

export function usePromise(promiseFunc) {
  const [loading, setLoading] = useState(false);
  let cancelled = false;
  useEffect(
    () => () => {
      cancelled = true;
    },
    []
  );
  function exec(...params) {
    promiseFunc = makeCancelable(promiseFunc, ...params);
    if (loading) {
      return Promise.resolve();
    }
    setLoading(true);
    return promiseFunc.promise
      .then(result => {
        if (!cancelled) {
          setLoading(false);
          return result;
        }
      })
      .catch(error => {
        if (!cancelled) {
          setLoading(false);
          return error;
        }
      });
  }
  return [loading, exec];
}
