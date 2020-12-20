import config from "../config/config";
import AxiosService from "../services/axios-service.js";

export default class EmployeeService {
  baseUrl = config.baseUrl;
  addEmployee(data) {
    return AxiosService.postService(`${this.baseUrl}/create`, data);
  }
  getAllEmployee() {
    return AxiosService.getService(`${this.baseUrl}/get`);
  }
  getEmployee(employee_id) {
    return AxiosService.getService(`${this.baseUrl}/get/${employee_id}`);
  }
  updateEmployee(employee_id,data) {
    return AxiosService.putService(`${this.baseUrl}/update/${employee_id}`, data);
  }
  deleteEmployee(employee_id) {
    return AxiosService.deleteService(`${this.baseUrl}/delete/${employee_id}`);
  }
} 