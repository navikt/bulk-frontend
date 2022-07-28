import ecsFormat from "@elastic/ecs-pino-format";
import log from "pino";

const logger = log(ecsFormat());

export default logger;
