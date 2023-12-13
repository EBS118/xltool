import React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import {sc} from ".././utils/util"
import Reviews from './Review';
import readXlsxFile from 'read-excel-file/node';

export default function StepperUI()
{
  const [activeStep, setActiveStep] = useState(0);
  const [gstin,setGstin] = useState('')
  const [gsterr,setGsterr] = useState(false) 
  const [data,setData] = useState([])
  const [start,setStart] = useState(0)
  const [end,setEnd] = useState(0)
  const [xldata,setXldata] = useState([])
  const [scd,setSc] = useState('')
  const [review,setReview] = useState([])

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
  const Getsc = (val)=>{
      let gv = val.slice(0,2)
      for(let i in sc)
      {
        if(i==gv)
        {
         return `${i} - ${sc[i]}`
        }
      }
  } 

  const setGst = (val)=>{
    setGstin(val.trim())
  }

  const handleNext = () => {
    if(!(Getsc(gstin.trim())??false))
    {
      setGsterr(true)
    }
    else if(activeStep==0)
    {
      ((!gstin.trim() || gstin.length != 15))?setGsterr(true):setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if(activeStep==1)
    {
      convertMe(data.slice(start+1,end))
      if(data.length)
      {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    else
    {
      alert("Upload A File")
    }
    }
    if(activeStep==2)
    {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if(activeStep==3)
    {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

function getRate(data)
{
if(data[10])
{
  return (data[10]/data[6])*100
}
else
{
  return ((data[12]+data[13])/data[6])*100
}
}
  const formateDate = (dv)=>{
    let dateObject = String(dv).split(' ');
    return dateObject[2]+"-"+dateObject[1]+"-"+dateObject[3][2]+dateObject[3][3]
  }
  const frmtnmbr = (num)=>{
if(num)
{
  return num.toFixed(2)
}
else{
  return (0).toFixed(2)
}
  }
  const convertMe = ()=>{
    const uploadDatas = data.slice(start+1,end).map(row => {
      let obj = {
        "GSTIN" :  row[4]??"",
            "VoucherNo" :  row[3]??"",
            "Date" :  formateDate(row[0])??"",
            "GrossTotal" :  frmtnmbr(row[8])??"",
             "Place" : Getsc(gstin),
             "Reverse_Charge": "N",
             "Invoice_Type" : "Regular",
             "Rate" : getRate(row).toFixed(2),
             "Value" :  row[6]??"",
             "IGST" :  frmtnmbr(row[10]),
             "CGST" :  frmtnmbr(row[12]),
             "SGST" :  frmtnmbr(row[13]),
             "Cess_paid" : "",  
             "Eligibility_For_ITC": "",
             "Availed_ITC_Integrated_Tax": "",
             "Availed_ITC_Central_Tax": "",
             "Availed_ITC_State_UT_Tax": "",
             "Availed_ITC_Cess": ""        
      }
      console.log(obj)
      return obj;
      });
    setReview(uploadDatas)
    }
    // "Particulars" :  row[1]??"",
    // "VoucherType" :  row[2]??"",   
    // "Quantity" :  row[5]??"",
    // "AddlCost" :  row[7]??"",
    // "IGSTPurchase" :  row[9]??"",
    // "PurchaeTaxable" :  row[11]??"",
    // "RoundOff": row[14]??"",   
  const steps = ['GSTIN', 'Upload Excel', 'Review'];


const convertMeSource = (v,i)=>{
console.log(v.indexOf("Date"))
}


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
             console.log(sheetData)
            setData(sheetData)
            sheetData.map((_value,_index)=>{
            check(_value,_index)
            convertMeSource(_value,_index)
             })
      
        });
        
    };
    reader.readAsBinaryString(file);
 
};

const frmtxl = (data)=>{
 let finalXl = data.map((val,i)=>{
   return {
    "GSTIN of Supplier" : val['GSTIN'],
    "Invoice Number": val['VoucherNo'],
    "Invoice date":val['Date'],
    "Invoice Value":val['GrossTotal'],
    "Place Of Supply":val['Place'],
    "Reverse Charge":val['Reverse_Charge'],
    "Invoice Type":val['Invoice_Type'],
    "Rate" : val['Rate'],
    "Taxable Value":val['Value'],
    "Integrated Tax Paid":val['IGST'],
    "Central Tax Paid":val['CGST'],
    "State/UT Tax Paid":val['SGST'],
    "Cess Paid":val['Cess_paid'],
    "Eligibility For ITC":val['Eligibility_For_ITC'],
    "Availed ITC Integrated Tax" : val['Availed_ITC_Integrated_Tax'],
    "Availed ITC Central Tax" : val['Availed_ITC_Central_Tax'],
    "Availed ITC State/UT Tax" : val['Availed_ITC_State_UT_Tax'],
    "Availed ITC Cess" : val['Availed_ITC_Cess'],
  }
 })
 return finalXl;
}

const createExcelFile = (xldata) => {
  let jsonData = frmtxl(xldata)
  const worksheetData = jsonData.map(item => {
    return Object.keys(item).map(key => item[key]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    Object.keys(jsonData[0]), // Use the keys of the first object as titles
    ...worksheetData,
  ]);
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveExcelFile(excelBuffer, `${gstin}_purchase.xlsx`);
};

const saveExcelFile = (buffer, fileName) => {
  const data = new Blob([buffer], { type: 'application/octet-stream' });
  console.log("BDATA",data)
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
};


const check = (stringData,ind)=>{
  stringData.map(_val=>{
   if(_val && (typeof _val == "string"))
   {
      if(_val.toLowerCase().includes("date"))
      {
         setStart(ind)
      }

      if(_val.toLowerCase().includes("total"))
      {
          {
              setEnd(ind)
           }
      }
   }
  })
}
    return (
        <Box className='p-5'>
          <Paper className='p-5' elevation={3} >
          <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
         <Box className="p-4 m-2">
         {/* <TextField id="standard-basic" label="Enter Your GSTIN" variant="standard"  style = {{width: "50%"}}/> */}
        {activeStep==0 && <div><input type='text' value={gstin} placeholder='ENTER GSTN' className='form-control' onChange={(e)=>{
          setGst(e.target.value)
          setGsterr(false)
        }}/>
        {  gsterr && activeStep==0 && <small className='text-danger'>GSTIN FORMATE INVALID</small>}</div>}
        {activeStep==1 && <div className='text-center'><div><br/><Tooltip title="Upload Your Tally Excel">    <Button color='success' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
      Upload file
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button></Tooltip  ></div></div>}
        {activeStep==2 && <div>
          <Reviews review={review} setReview={(arr)=>setReview(arr)}/>
          </div>}
        {activeStep==3 && <button onClick={()=>{
          console.log(review)
        }}>Download</button>}
         </Box>

          {activeStep === steps.length - 1  ? <div className='text-center '>
          <Button onClick={handleBack}  variant='contained'>
              back
            </Button> &nbsp;
          <Button onClick={()=>createExcelFile(review)} color="success" variant='contained'>
              Download
            </Button>
            </div> :   <Box  sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
            variant='contained'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button onClick={handleNext} variant='contained'>
             Next
            </Button>
          </Box>  }
        </React.Fragment>
      )}
            </Paper>
        </Box>
      );
}