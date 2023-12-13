import React, {useState,useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Reviews({review,setReview}){
  const [temp,setTemp] = useState([])
  useEffect(()=>{
    setTemp(review)
  },[])
const rows = ["GSTIN","Invoice Number","Invoice date","Invoice Value","Supply Place","Reverse Charge","Invoice Type","Rate","Taxable Value","IGST","CGST","SGST","Cess Paid","AvailedITC IntegratedTax","AvailedITC CentralTax","AvailedITC State/UTTax","AvailedITC Cess"]
const updateData = (v,i,p)=>{
temp[i][p]=v
setReview(temp)
}
const frmtspace = (val)=>{
  return val.trim()? val : "-";
}
    return (
        <TableContainer component={Paper}>
          <Table style={{ width: "120%" }} aria-label="simple table">
            <TableHead>
              <TableRow style={{"background-color" : "#2a2585"}}>
                {
                  rows.map((row_name)=>{
                    return  <TableCell className="text-light fw-bold" >{row_name}</TableCell>
                  })
                }        
              </TableRow>
            </TableHead>
            <TableBody>
              {review.map((row,_index) => (
                <TableRow
                  key={row.GSTIN}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" padding='inherit' onClick={()=>console.log(temp)}>
                   <span className={row.GSTIN.length != 15?"text-danger" : "text-dark"}> {row.GSTIN}</span>
                  </TableCell>
                  <TableCell align="right" >{row.VoucherNo}</TableCell>
                  <TableCell align="right" style={{padding : 'inherit'}}>{row.Date}</TableCell>
                  <TableCell align="right">{row.GrossTotal}</TableCell>
                  <TableCell align="right" style={{padding : 'inherit'}}>{row.Place}</TableCell>
                  <TableCell align="right">                  <select class="form-select form-select-lg mb-3" style={{width : "70px"}} onChange={(e)=>{
                         updateData(e.target.value,_index,"Reverse_Charge")
                  }}>
                        <option selected value="N">N</option>
                        <option value="Y">Y</option>
                    </select></TableCell>
                  <TableCell align="right">
                  <select class="form-select form-select-lg mb-3" style={{width : "150px"}}  onChange={(e)=>{
                         updateData(e.target.value,_index,"Invoice_Type")
                  }}>
                        <option selected value="Regular">Regular</option>
                        <option value="SEZ Supplies With Payment">SEZ Supplies With Payment</option>
                        <option value="SEZ Supplies With Out Payment">SEZ Supplies With Out Payment</option>
                        <option value="Deemed Export">Deemed Export</option>
                    </select>
                  </TableCell>
                  <TableCell align="right"><select class="form-select form-select-lg mb-3" value={row.Rate} style={{width : "100px"}}>
                        <option selected={row.Rate=="18.00"}  disabled={!(row.Rate=="18.00")} >0.00</option>
                        <option selected={row.Rate=="0.10"}  disabled={!(row.Rate=="0.10")} >0.10</option> 
                        <option selected={row.Rate=="0.25"}  disabled={!(row.Rate=="0.25")} >0.25</option>
                        <option selected={row.Rate=="3.00"}  disabled={!(row.Rate=="3.00")} >3.00</option>
                        <option selected={row.Rate=="5.00"}  disabled={!(row.Rate=="5.00")} >5.00</option>
                        <option selected={row.Rate=="12.00"}  disabled={!(row.Rate=="12.00")} >12.00</option>
                        <option selected={row.Rate=="18.00"}  disabled={!(row.Rate=="18.00")} >18.00</option>
                        <option selected={row.Rate=="28.00"}  disabled={!(row.Rate=="2  8.00")} >28.00</option>
                    </select></TableCell>
                  <TableCell align="right">{row.Value}</TableCell>
                  <TableCell align="right">{row.IGST}</TableCell>
                  <TableCell align="right">{row.CGST}</TableCell>
                  <TableCell align="right">{row.SGST}</TableCell>
                  <TableCell align="right"> {frmtspace(row.Cess_paid)}</TableCell>
                  <TableCell align="right"><select class="form-select form-select-lg mb-3" onChange={(e)=>{
                         updateData(e.target.value,_index,"Eligibility_For_ITC")
                  }} style={{width : "150px"}}>
                    <option selected value="">-</option>   
                  <option  value="Inputs">Inputs</option>   
                        <option value="Capital goods">Capital goods</option>
                        <option value="Input services">Input services </option>
                        <option  value="Ineligible">Ineligible</option>
                    </select></TableCell>
                  <TableCell align="right">{frmtspace(row.Availed_ITC_Integrated_Tax)}</TableCell>
                  <TableCell align="right">{frmtspace(row.Availed_ITC_Central_Tax)}</TableCell>
                  <TableCell align="right">{frmtspace(row.Availed_ITC_State_UT_Tax)}</TableCell>
                  <TableCell align="right">{frmtspace(row.Availed_ITC_Cess)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}