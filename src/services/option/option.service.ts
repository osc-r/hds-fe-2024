import Client from "../client";
import { BaseResponse } from "../type";
import { Option } from "./option";

class OptionService {
  getDegreeOptions() {
    return Client.instance.get<BaseResponse<Option>>(`/v1/option/degree-level`);
  }
}

const optionService = new OptionService();
Object.freeze(optionService);

export default optionService;
