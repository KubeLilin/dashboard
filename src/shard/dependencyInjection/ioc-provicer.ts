import "reflect-metadata";

import container from "../inversionofcontrol/inversionofcontrol";
import { interfaces } from "inversify";

export default function Provider<T>(params: interfaces.ServiceIdentifier<T>) {
  return (target: any, attr: T) => {
    target[attr] = container.get<T>(params);
    return target[attr];
  };
} 