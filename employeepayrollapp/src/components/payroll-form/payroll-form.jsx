import React, { useState, useEffect } from 'react';
import profile1 from '../../assets/profile-images/Ellipse -1.png';
import profile2 from '../../assets/profile-images/Ellipse -3.png';
import profile3 from '../../assets/profile-images/Ellipse -7.png';
import profile4 from '../../assets/profile-images/Ellipse -8.png';
import './payroll-form.scss';
import EmployeeService from "../../services/employee-payroll-service";
import logo from 'D:/ReactJS/demoReact/EmployeePayrollApp/employeepayrollapp/employeepayrollapp/src/assets/images/logo.png'
import { useParams, Link, withRouter ,Redirect} from 'react-router-dom';

const PayrollForm = (props) => {
    let initialValue = {
        name: '',
        profileArray: [
            { url: '../../assets/profile-images/Ellipse -1.png' },
            { url: '../../assets/profile-images/Ellipse -3.png' },
            { url: '../../assets/profile-images/Ellipse -7.png' },
            { url: '../../assets/profile-images/Ellipse -8.png' }

        ],
        allDepartment: [
            'HR', 'Sales', 'Finance', 'Engineer', 'Others'
        ],
        departmentValue: [],
        gender: '',
        salary: '',
        day: 'Day',
        month: 'Month',
        year: 'Year',
        startDate: '',
        notes: '',
        id: '',
        profilePic: '',
        isUpdate: false,
        error: {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
    }
    const [formValue, setForm] = useState(initialValue);
    const employeeService = new EmployeeService();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
          getDataById(params.id);
        }
      }, []);

      const getDataById = (id) => {
        employeeService
          .getEmployee(id)
          .then((data) => {
            console.log("data is ", data.data.data);
            let obj = data.data.data;
            //console.log("obj id inside get id method: "+obj.employee_id);
            setData(obj);
          })
          .catch((err) => {
            console.log("err is ", err);
          });
      };
    
    const setData = (obj) => {
        //console.log("Object id while setform call "+obj.employee_id);
        //console.log("StartDate "+obj.startDate);
        let array = obj.startDate.split("-");
        setForm({
          ...formValue,
          ...obj,
          id: obj.employee_id,
          departmentValue: obj.departments,
          isUpdate: true,
          day: array[0],
          month: array[1],
          year: array[2],
        });
      };

    const changeValue = (event) => {
        setForm({ ...formValue, [event.target.name]: event.target.value })
        console.log(event.target.value)
    }

    const onCheckChange = (name) => {
        let index = formValue.departmentValue.indexOf(name);
       
        let checkArray = [...formValue.departmentValue]
        if (index > -1)
            checkArray.splice(index, 1)
        else
            checkArray.push(name);
        setForm({ ...formValue, departmentValue: checkArray });
    }
    const getChecked = (name) => {
        return formValue.departmentValue && formValue.departmentValue.includes(name);
    }

    const stringifyDate = (date) => {
        const options = {day: 'numeric', month: 'short', year: 'numeric'};
        const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-IN', options);
        return newDate;
     };
     
    const handleValidations = async () => {
        let isError = false;
        let error = {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
        if (!formValue.name.match('^[A-Z]{1}[a-zA-Z]{2,}')) {
            error.name = 'Name is Invalid!!'
            isError = true;
        }
        if (formValue.gender.length < 1) {
            error.gender = 'Gender is a required field'
            isError = true;
        }
        
        if ((formValue.salary.valueOf()<400000)||(formValue.salary.valueOf()>500000)) {
            error.salary = 'Salary should be between 4,00,000 and 5,00,000!!'
            isError = true;
        }
        if (formValue.profilePic.length < 1) {
            error.profilePic = 'Profile is a required field'
            isError = true;
        }

        if (formValue.departmentValue.length < 1) {
            error.department = 'Department is a required field'
            isError = true;
        }
        var day = formValue.day.valueOf();
        var month = formValue.month.valueOf();
        var year = formValue.year.valueOf();
        var date = new Date(day+"-"+month+"-"+year);
        //console.log("Date here :"+date);
        var nowDate = Date.now();
        //console.log(" Check Date here :"+nowDate);
        if(date>nowDate){
            error.startDate = "StartDate is a future Date!!"
            isError = true;
        }
        if(formValue.notes.length < 1){
            error.notes = "Notes is a required field"
            isError = true;
        }
        await setForm({ ...formValue, error: error })
        return isError;

    }
    const save = async (event) => {
        event.preventDefault();
     
        if(await handleValidations()){
            console.log("error", formValue);
            return;
        }else{
        let object = {
            name: formValue.name,
            department: formValue.departmentValue,
            gender: formValue.gender,
            salary: formValue.salary,
            startDate: `${formValue.day}-${formValue.month}-${formValue.year}`,
            notes: formValue.notes,
            id: formValue.id,
            profilePic: formValue.profilePic,
          };
          if (formValue.isUpdate) {
              console.log("Updating object with id :"+formValue.id);
            employeeService
              .updateEmployee(formValue.id,object)
              .then((data) => {
                  var answer =  window.confirm("Data once modified cannot be restored!! Do you wish to continue?");
                  if(answer == true){
                  alert("Data updated successfully!");
                console.log("data after update", data.data.data);
                props.history.push("");
                  }else{
                      window.location.reload();
                  }
              })
              .catch((error) => {
                alert("WARNING!! Error updating the data!");
                console.log("Error after update"+error);
              });
          } else {
            employeeService
              .addEmployee(object)
              .then((data) => {
                  alert("Data Added successfully!!")
                console.log("Employee payroll added");
                props.history.push("");
              })
              .catch((err) => {
                  alert("WARNING!! Error while adding the data!");
                console.log("error occured while adding employee");
              });
          }
        }
          };
  
  
    const reset = () => {
        setForm({ ...initialValue, id: formValue.id, isUpdate: formValue.isUpdate });

        console.log(formValue);
    }
    return (
        <div className="payroll-main">
            <header className='header row center'>
                <div className="logo">
                    <img src={logo} alt="" />
                    <div>
                        <span className="emp-text">EMPLOYEE</span> <br />
                        <span className="emp-text emp-payroll">PAYROLL</span>
                    </div>
                </div>
            </header>
            <div className="content">
                <form className="form" action="#" onSubmit={save}>
                    <div className="form-head">Employee Payroll form</div>
                    <div className="row">
                        <label className="label text" htmlFor="name">Name</label>
                        <input className="input" type="text" id="name" name="name" value={formValue.name} onChange={changeValue} placeholder="Your name.." />
                    <error className="error">{formValue.error.name}</error>
                    </div>
                    <div className="row">
                        <label className="label text" htmlFor="profilePic">Profile image</label>
                        <div className="profile-radio-button">
                            <label >
                                <input type="radio" name="profilePic" checked={formValue.profilePic === '../../assets/profile-images/Ellipse -1.png'} value="../../assets/profile-images/Ellipse -1.png" onChange={changeValue} />
                                <img className="profile" src={profile1} alt="profile" />
                            </label>
                            <label >
                                <input type="radio" name="profilePic" checked={formValue.profilePic === '../../assets/profile-images/Ellipse -3.png'} value="../../assets/profile-images/Ellipse -3.png" onChange={changeValue} />
                                <img className="profile" src={profile2} alt="profile" />
                            </label>
                            <label >
                                <input type="radio" name="profilePic" checked={formValue.profilePic === '../../assets/profile-images/Ellipse -7.png'} value="../../assets/profile-images/Ellipse -7.png" onChange={changeValue} />
                                <img className="profile" src={profile3} alt="profile" />
                            </label>
                            <label >
                                <input type="radio" name="profilePic" checked={formValue.profilePic === '../../assets/profile-images/Ellipse -8.png'} value="../../assets/profile-images/Ellipse -8.png" onChange={changeValue} />
                                <img className="profile" src={profile4} alt="profile" />
                            </label>

                        </div>
                        <error className="error">{formValue.error.profilePic}</error>
                    </div>
                    <div className="row">
                        <label className="label text" htmlFor="gender">Gender</label>
                        <div>
                            <input type="radio" id="male" checked={formValue.gender === 'male'} onChange={changeValue} name="gender" value="male" />
                            <label className="text" htmlFor="male">Male</label>
                            <input type="radio" id="female" checked={formValue.gender === 'female'} onChange={changeValue} name="gender" value="female" />
                            <label className="text" htmlFor="female">Female</label>
                        </div>
                        <error className="error">{formValue.error.gender}</error>
                    </div>
                    <div className="row">
                        <label className="label text" htmlFor="department">Department</label>
                        <div>
                            {formValue.allDepartment.map(item => (
                                <span key={item}>
                                    <input className="checkbox" type="checkbox" onChange={() => onCheckChange(item)} name={item}
                                        checked={getChecked(item)} value={item} />
                                    <label className="text" htmlFor={item}>{item}</label>
                                </span>
                            ))}

                        </div>
                        <error className="error">{formValue.error.department}</error>
                    </div>
                    
                    <div className="row">
                        <label className="label text" htmlFor="salary">Salary</label>
                        <input className="input" type="text" id="salary" name="salary" value={formValue.salary} onChange={changeValue} />
                        <error className="error">{formValue.error.salary}</error>
                    </div>

                    <div className="row">
                        <label className="label text" htmlFor="startDate">Start Date</label>
                        <div>
                            <select value={formValue.day} onChange={changeValue} id="day" name="day">
                                <option value="Day">Day</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                                <option value="22">22</option>
                                <option value="23">23</option>
                                <option value="24">24</option>
                                <option value="25">25</option>
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                                <option value="31">31</option>
                            </select>
                            <select value={formValue.month} onChange={changeValue} id="month" name="month">
                                <option value="Month">Month</option>
                                <option value="01">January</option>
                                <option value="02">Febuary</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                            <select value={formValue.year} onChange={changeValue} id="year" name="year">
                                <option value="Year">Year</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                                <option value="2017">2017</option>
                                <option value="2016">2016</option>
                            </select>
                        </div>
                        <error className="error">{formValue.error.startDate}</error>
                    </div>
                    
                    <div className="row">
                        <label className="label text" htmlFor="notes">Notes</label>
                        <textarea onChange={changeValue} id="notes" value={formValue.notes} className="input" name="notes" placeholder=""
                            style={{ height: '120%' }}></textarea>
                    <error className="error">{formValue.error.notes}</error>
                    </div>

                    <div className="buttonParent">
                        <Link to="" className="resetButton button cancelButton">Cancel</Link>

                        <div className="submit-reset">
                            <button type="submit" className="button submitButton" id="submitButton">{formValue.isUpdate ? 'Update' : 'Submit'}</button>
                            <button type="button" onClick={reset} className="resetButton button">Reset</button>
                        </div>
                    </div >
                </form >
            </div >
        </div >
    )
}
export default withRouter(PayrollForm);