
export const InstituteAdminFields = ['institute_id','first_name','last_name','phone_number','email','uuid','image',"id","username","role","contact_info","is_active","_id","branch"]
export const StudentFields =['institute_id','branch_id','batch_id','course','qualification','first_name','last_name','phone_number','email','uuid']
export const TeacherFields = ['first_name','last_name','email','phone_number','email','uuid','institute_id','branch_id','course','username']
export const NonTeachingFields = ['first_name','last_name','email','phone_number','uuid','institute_id','branch_id','designation']


export const DefaultFilterQuerys ={
    branch:{is_active:'',slug:'',branch_identity:''},
    category : {is_active:'',category_name:'',slug:''},
    course : {is_active:'',course_name:"",branch_id:"",slug:"",uuid:'',class_type:"",category:''},
    faq_category : { is_active: '',category_name : ""},
    batch : {is_active:"",start_date:'',end_date:'',branch_name:'',course:'' },
    batch_student: {course:'',batch:''},
    course_modules : { is_active: '', course : ''},
    study_material : { is_active:'',course:'',branch:"",course:'',slug:'',institute:''},
    notes : {is_active:'',course:'',branch:'',slug:'',institute:''},
    user : {institute_id:"",branch : '',role:'',is_active:''},
    online_class : { is_active:'',course:"",batch:'',institute:'',branch:'',start_date:''},
    offline_class : { is_active:'',course:"",batch:'',institute:'',branch:'',start_date:'',end_date:''},
    institute_user : {is_active:''},
    teaching_staff : { course : ''},
    batch_user : {is_active:""},
    student_ticket : {status:""},
    student_attedence: {batch:''},
    teaching_staff_attedence : { is_active:'', status:''},
    non_teaching_staff_attedence : { is_active:''},
    teaching_staff_ticket : { status: ""},
    admin_ticket : {status:""},
    class : { classType : '' },
    activity_logs : { timestamp : ""},
    institute_notification : { status: ""}
}

export const DefaultUpdateFields = {
    branch : {branch_identity:"",is_active:"",is_deleted:'',contact_info:{phone_no:"", address: "", city: "", landmark : "", pincode: "", state: "",alternate_no: ""}},
    category : {'category_name':"",'is_active':'',image:''},
    course : {is_active:'',course_name:"",slug:"",class_type:"",category:'',description:'',duration:'',image:'',price:''},
    non_teaching_staff : {full_name:'',dob:"",gender:"",qualification:"",contact_info:'',userDetail:'',course:'',email:''},
    non_teaching_staff1 : {designation:'',username:"",course:''},
    teaching_staff : {full_name:'',dob:"",gender:"",qualification:"",contact_info:'',userDetail:'',course:'',is_active:'',image:'',email:''},
    teaching_staff1 : {designation:'',username:"",course:''},
    faq_category : {is_active:'',category_name:'',description: '',accessby:[]},
    platform_faq_category : { identity:'',description:'',is_active:''},
    platform_faq : {identity:'',description:'',category:'',is_active:''},
    course_modules : { title:'',description : '',video:'',},
    notes : { description:'',title:"",file:'',is_active: ""},
    study_material: { title: "", description: "", file: "",is_active:""},
    adminUser : {first_name:'',last_name:'',email:'',phone_number:'',branch:'',designation:'',role:'',image:'',is_active:''},
    offline_class : {class_name:'',start_date:'',start_time:'',end_time:'',instructors:'',coordinators:'',is_active:''},
    online_class : {class_name:'',start_date:'',start_time:'',end_time:'',instructors:'',coordinators:'',is_active:'',video_url:''},
    certificate:{institute_id:'',branch_id:'',course:'',batch_id:'',certificate_name:'',student:'',is_active:'',file_upload:''},
    institute_user_student : {first_name:'',last_name:'',username:'',image:'',email:"",dob:'',gender:'',contact_info:''},
    student : {course:'',},
    batch : {batch_name:'',is_active:'',start_date:'',end_date:'',student:''},
    student_ticket : {is_active:'',status:''},
    admin_ticket:{is_active:'',solution:'', resolved: '', status: ""},
    class : { study_materials : '', type:'', uuid : '', notes : '', videos:'' },
    institute_notification: { status: ""},
    institute: {
        institute_name: "",
        email: "",
        contact_info: {
            phone_no: "",
            alternate_no: "",
            address: {
                address1: "",
                address2: "",
                state: "",
                city: "",
                pincode: ""
            }
        },
        website: "",
        description: "",
        logo: "",
        image: "",
        gallery_images: [],
        social_media: {
            twitter_id: "",
            facebook_id: "",
            instagram_id: "",
            linkedin_id: "",
            pinterest_id: ""
        },
        is_active: "",
        is_deleted: ""
    }
}


export var MockEmailData = []