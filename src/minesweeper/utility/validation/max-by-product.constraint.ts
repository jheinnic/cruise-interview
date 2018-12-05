import {
   registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint,
   ValidatorConstraintInterface
} from 'class-validator';
// import {CustomValidationOptions} from './custom-validation-options.interface';

@ValidatorConstraint({async: false})
export class IsDevelopmentOnlyValidator implements ValidatorConstraintInterface
{
   validate(value: any, args: ValidationArguments): boolean
   {
      const selector: (subject: any) => number = args.constraints[0];
      const boundary = selector(args.object);
      return value <= boundary;
   }
}

export function MaxByProduct(terms:PropertyKey[], validationOptions?: ValidationOptions)
{
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [(subject: any): number => {
            if (! terms.every((nextKey: PropertyKey): boolean => {
               return subject.hasOwnProperty(nextKey);
            })) {
               throw new Error(`Not all properties defined: ${terms}`);
            }

            return terms.reduce((product: number, nextKey: PropertyKey) => {
               return product * subject[nextKey];
            }, 1);
         }],
         validator: IsDevelopmentOnlyValidator
      });
   };
}