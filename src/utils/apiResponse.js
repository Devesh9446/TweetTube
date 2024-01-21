class apiResponse{
    constructor(statusCode, data, message="Success"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode < 400
    }
}

//status code chart
//information response(100-199)
//successful response(200-299)
//redirection message(300-399)
//client error response(400-499)
//server error response(500-599)
export {apiResponse}