// 表单验证方法

export function validate(formRef,callback) {
    if (formRef) {
        formRef.validate((valid, fields) => {
            if (valid) {
              
                    if(typeof callback==='function')
                    {
                        callback();
                    }
            }
            else {
                const key = Object.keys(fields)[0]
                window.$message({
                    message: fields[key][0].message,
                    type: 'error'
                });
            }
        }
        )

    }
}