export const catchAsyncErrors=(passedFunc)=>(req,res,next)=>{
    Promise.resolve(passedFunc(req,res,next)).catch(next)}







    




   