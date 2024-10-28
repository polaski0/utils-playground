// Prepare<T extends TCommonAttributesDTO>(
//   dto: T,
//   cb ?: (
//     key: keyof T,
//     dto: T,
//     error: Partial<Pick<TApiResult, "hasError" | "data">>,
//   ) => void,
// ) {
//   const prepareCommonAttributes = <T extends TCommonAttributesDTO>(
//     key: keyof T,
//     dto: T,
//     error: Pick<TApiResult, "hasError"> & {
//       data: TApiError[];
//     },
//   ) => {
//     const effectiveDate =
//       dto.EffectiveDate !== undefined && dto.EffectiveDate
//         ? new Date(dto.EffectiveDate)
//         : undefined;
//     const expiryDate =
//       dto.ExpiryDate !== undefined && dto.ExpiryDate
//         ? new Date(dto.ExpiryDate)
//         : undefined;
// 
//     switch (key) {
//       case "StatusFlag":
//         {
//           if (!effectiveDate || !expiryDate) break;
// 
//           (dto[key] as string) = expiryDate < effectiveDate ? "I" : "A";
//         }
//         break;
//       case "EffectiveDate":
//       case "ExpiryDate":
//         if (!effectiveDate || !expiryDate) break;
//         if (effectiveDate.getTime() > expiryDate.getTime()) {
//           error.hasError = true;
//           if (key === "EffectiveDate") {
//             this._generateError(
//               key,
//               dto[key] as string,
//               "Effective date should be before the Expiry date.",
//               error.data,
//             );
//           }
//           if (key === "ExpiryDate") {
//             this._generateError(
//               key,
//               dto[key] as string,
//               "Expiry date should be after than the Effective date.",
//               error.data,
//             );
//           }
//         }
//         break;
//       default:
//         return;
//     }
//   };
// 
//   const error: Pick<TApiResult, "hasError"> & {
//     data: TApiError[];
//   } = {
//     hasError: false,
//     data: [],
//   };
//   const value = dto;
// 
//   let key: keyof T;
//   for (key in value) {
//     prepareCommonAttributes(key, value, error);
//     cb && cb(key, value, error);
//   }
// 
//   if (error.data.length) {
//     error.hasError = true;
//   }
// 
//   return { error, value };
// }
