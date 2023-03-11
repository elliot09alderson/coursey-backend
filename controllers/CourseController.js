import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { CourseModel } from "../models/CourseModel.js"
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import cloudinary from 'cloudinary'



export const getAllCourse= catchAsyncErrors(
    
    async(req,res,next)=>{
        const keyword = req.query.keyword || "";
        const category = req.query.category || "";    

        
       
        const courses =await CourseModel.find({  title:{
            $regex:keyword,
            $options:"i"
        },
    category:{
        $regex:category,
        $options:"i"
        
    }
    }).select("-lectures") ;
      
        res.status(200).json({
            success:true,
            data:courses
        })
    }
    )


// ____________________________CREATE COURSE FUNCTIONALITY___________________________
    export const createCourse=catchAsyncErrors(async(req,res,next)=>{
        const {title,description,category,createdBy} = req.body;
        if(!title || !description || !category || !createdBy)
        return next(new ErrorHandler("please add all fields",400));
       const file  = req.file;
    //    console.log(file)
       const fileUri = getDataUri(file)

       const mycloud = await cloudinary.v2.uploader.upload(fileUri.content)
       const course =  await CourseModel.create({
            title,
            description,
            category,
            createdBy,
            poster:{
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            }
        })
        res.status(201).json({
            message:'Course created successfully',
            course
        })

    })
// ___________________________________________________________________________________________


// __________________________________GET LECTURES________________________________________________________
export const getCourseLectures = catchAsyncErrors(async(req,res,next)=>{
    const {id}  = req.params
    const course = await CourseModel.findById(id)
    if(!course) return next(new ErrorHandler("Course not found",404))
    course.views+=1
    await course.save()
    res.status(200).json({
        success : true,
        lectures:course.lectures
    })
})
// ___________________________________________________________________________________________




// __________________________________ADD LECTURES________________________________________________________
//max video size 100mb
export const addLectures =   catchAsyncErrors(async(req,res,next)=>{
    const {title,description} = req.body
    const {id}  = req.params
    // const file = req.file
    const course = await CourseModel.findById(id)
    if(!course) return next(new ErrorHandler("Course not found",404))
    const file  = req.file;
    console.log(file)
    const fileUri = getDataUri(file)
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{resource_type:"video"})
 //upload file here
 course.lectures.push({
    title,description,video:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
 })
 course.numOfVideos = course.lectures.length
    await course.save()

    res.status(200).json({
        success : true,
      message: "lecture added successfully"
    })
})


export const deleteCourse=catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const course = await CourseModel.findById(id)
   if(!course) return next((new ErrorHandler("Course not found",404)))
 
  await cloudinary.v2.uploader.destroy(course.poster.public_id)
  for(let i= 0;i<course.lectures.length;i++){
    const element = course.lectures[i]
    await cloudinary.v2.uploader.destroy(element.video.public_id,{resource_type:"video"})
    
  }

  await course.remove()
    res.status(20).json({
        message:'Course deleted successfully',
        course
    })

})



export const deleteLecture=catchAsyncErrors(async(req,res,next)=>{
    const {courseId,lectureId} = req.query;
    const course = await CourseModel.findById(courseId)
   if(!course) return next((new ErrorHandler("Course not found",404)))
 const lecture = course.lectures.filter(item=>{
    if(item._id.toString()===lectureId.toString()) return item
 })
  await cloudinary.v2.uploader.destroy(lecture.video.public_id,{resource_type:"video"})
  
course.lectures = course.lectures.filter((item)=>{
    if(item._id.toString() !== lectureId.toString()) return item
})
course.numOfVideos = course.lectures.length
  await course.save()
    res.status(20).json({
        message:'Lecture deleted successfully',
        course
    })

})