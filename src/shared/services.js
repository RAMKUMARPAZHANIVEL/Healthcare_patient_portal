import Helper from "shared/helper";
import session from "shared/session";
import { apiUrl as serverApi, springSecurityApi, chat_URL } from "config";

const GetEntityInfo = async (name) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GenerateOTP = async (userId,type,data) => {
    let _type = 'EMAIL';
    if(type === 'mobileNumber') _type = 'SMS';
    return new Promise(async (resolve) => {
        let url = `${springSecurityApi}/users/${userId}/start-verifications`;

        let token = await session.GetHeader();
        
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ types : [_type] }),
          });
  
        if (res.status === 200 || res.status === 204) {
          return resolve({ status: res.ok });
        }
        const json = await res.json();
  
        return resolve({ status: false, statusText: json.error.message });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};
  
const VerifyOTP = async (type, otp) => {
    let _type = 'EMAIL';
    if(type === 'mobileNumber') _type = 'SMS';
    const userId = session.Retrieve("userId");
    return new Promise(async (resolve) => {
      let url = `${springSecurityApi}/users/${userId}/verify`;
  
      let token = await session.GetHeader();
        
        try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({type : _type, otp}),
        });
       
        if (res.status === 200 || res.status === 202) {
          return resolve({ status: res.ok, values: false });
        }
        const json = await res.json();
        return resolve({ status: false, statusText: json.error.message });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};
  
const SignupUser = async (data) => {
    return new Promise(async (resolve) => {
      let url = `${springSecurityApi}/signup`;
          
        try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const json = await res.json();
        if (res.status === 200 || res.status === 201) {
          return resolve({ status: res.ok, values: json || [] });
        }
  
        return resolve({ status: false, statusText: json.errors[0] });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};
  
const LoginUser = async (data) => {
    return new Promise(async (resolve) => {
      let url = `${springSecurityApi}/login`;

        try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const json = await res.json();
        if (res.status === 200 || res.status === 201) {
          return resolve({ status: res.ok, values: json || [] });
        }
  
        return resolve({ status: false, statusText: json.errors[0] });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};
  
const ResetPassword = async (data) => {
    const userId = session.Retrieve("userId");

    return new Promise(async (resolve) => {
      let url = `${springSecurityApi}/users/${userId}/updatePassword`;
          
        try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        const json = await res.json();
        if (res.status === 200 || res.status === 201) {
          return resolve({ status: res.ok, values: json || [] });
        }
  
        return resolve({ status: false, statusText: json.errors[0] });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};

const ForgotPassword = async (data) => {
    return new Promise(async (resolve) => {
        let url = `${springSecurityApi}/users/forgotPassword`;

        let token = await session.GetHeader();
        
        try {
          const res = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          
        const json = await res.json();

        if (res.status === 200 || res.status === 202) {
          return resolve({ status: res.ok, values: json });
        }
  
        return resolve({ status: false, statusText: json.error.message });
      } catch (error) {
        console.log(error);
        return resolve({ status: false, statusText: error.message });
      }
    });
};

/* Prescriptions */

const GetPrescriptionsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Prescriptions/$count`;
        if (query) url = `${serverApi}Prescriptions/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetPrescriptionsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Prescriptions`;
        if (query) url = `${serverApi}Prescriptions?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPrescriptionSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Prescriptions(${id})`;
        if (params) {
            url = `${serverApi}Prescriptions(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetPrescriptionSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.PrescriptionId;
        let method = "POST";
        let url = `${serverApi}Prescriptions`;
        if (input.PrescriptionId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Prescriptions(${input.PrescriptionId})`;
        } else if (input.PrescriptionId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Prescriptions(${input.PrescriptionId})`;
        }

        delete input['PrescriptionId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PrescriptionId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   							// For Nested APIs
			/* $navPropName */

const SetPrescriptionItemsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, PrescriptionId, PrescribedItemId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}PrescriptionItemss`;
        let data = { PrescribedItemId, PrescriptionId: PrescriptionId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}PrescriptionItemss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}PrescriptionItemss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPrescriptionItemsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}PrescriptionItemss?$filter=PrescriptionId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetPrescriptionLabTestsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, PrescriptionId, LabTestId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}PrescriptionLabTestss`;
        let data = { LabTestId, PrescriptionId: PrescriptionId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}PrescriptionLabTestss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}PrescriptionLabTestss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPrescriptionLabTestsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}PrescriptionLabTestss?$filter=PrescriptionId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        		
	
	    
	 	
	
		
/* Availabilities */

const GetAvailabilitiesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Availabilities/$count`;
        if (query) url = `${serverApi}Availabilities/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetAvailabilitiesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Availabilities`;
        if (query) url = `${serverApi}Availabilities?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetAvailabilitySingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Availabilities(${id})`;
        if (params) {
            url = `${serverApi}Availabilities(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetAvailabilitySingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.AvailabiltyId;
        let method = "POST";
        let url = `${serverApi}Availabilities`;
        if (input.AvailabiltyId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Availabilities(${input.AvailabiltyId})`;
        } else if (input.AvailabiltyId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Availabilities(${input.AvailabiltyId})`;
        }

        delete input['AvailabiltyId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.AvailabiltyId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   							// For Nested APIs
			/* $navPropName */

const SetAvailabilitySlotsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, AvailabiltyId, SlotId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}AvailabilitySlotss`;
        let data = { SlotId, AvailabiltyId: AvailabiltyId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}AvailabilitySlotss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}AvailabilitySlotss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetAvailabilitySlotsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}AvailabilitySlotss?$filter=AvailabiltyId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        		
	
	    
	 	
	
		
/* Appointments */

const GetAppointmentsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Appointments/$count`;
        if (query) url = `${serverApi}Appointments/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetAppointmentsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Appointments`;
        if (query) url = `${serverApi}Appointments?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetAppointmentSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Appointments(${id})`;
        if (params) {
            url = `${serverApi}Appointments(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetAppointmentSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.AppointmentId;
        let method = "POST";
        let url = `${serverApi}Appointments`;
        if (input.AppointmentId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Appointments(${input.AppointmentId})`;
        } else if (input.AppointmentId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Appointments(${input.AppointmentId})`;
        }

        delete input['AppointmentId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.AppointmentId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   	   	   	   							// For Nested APIs
			/* $navPropName */

const SetAppointmentDocumentsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, AppointmentId, DocId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}AppointmentDocumentss`;
        let data = { DocId, AppointmentId: AppointmentId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}AppointmentDocumentss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}AppointmentDocumentss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetAppointmentDocumentsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}AppointmentDocumentss?$filter=AppointmentId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   	   	   							// For Nested APIs
			/* $navPropName */

const SetAppointmentRemindersJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, AppointmentId, ReminderId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}AppointmentReminderss`;
        let data = { ReminderId, AppointmentId: AppointmentId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}AppointmentReminderss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}AppointmentReminderss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetAppointmentRemindersJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}AppointmentReminderss?$filter=AppointmentId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   		
	
	    
	 	
	
		
/* Reminders */

const GetRemindersCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Reminders/$count`;
        if (query) url = `${serverApi}Reminders/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetRemindersMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Reminders`;
        if (query) url = `${serverApi}Reminders?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetReminderSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Reminders(${id})`;
        if (params) {
            url = `${serverApi}Reminders(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetReminderSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.ReminderId;
        let method = "POST";
        let url = `${serverApi}Reminders`;
        if (input.ReminderId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Reminders(${input.ReminderId})`;
        } else if (input.ReminderId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Reminders(${input.ReminderId})`;
        }

        delete input['ReminderId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.ReminderId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* SpecialtyCategories */

const GetSpecialtyCategoriesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}SpecialtyCategories/$count`;
        if (query) url = `${serverApi}SpecialtyCategories/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetSpecialtyCategoriesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}SpecialtyCategories`;
        if (query) url = `${serverApi}SpecialtyCategories?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetSpecialtyCategorySingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}SpecialtyCategories(${id})`;
        if (params) {
            url = `${serverApi}SpecialtyCategories(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetSpecialtyCategorySingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.Name;
        let method = "POST";
        let url = `${serverApi}SpecialtyCategories`;
        if (input.Name && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}SpecialtyCategories(${input.Name})`;
        } else if (input.Name && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}SpecialtyCategories(${input.Name})`;
        }

        delete input['Name'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Name });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* ChatMessages */

const GetChatMessagesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ChatMessages/$count`;
        if (query) url = `${serverApi}ChatMessages/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetChatMessagesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}ChatMessages`;
        if (query) url = `${serverApi}ChatMessages?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetChatMessageSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}ChatMessages(${id})`;
        if (params) {
            url = `${serverApi}ChatMessages(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetChatMessageSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.ChatMessageId;
        let method = "POST";
        let url = `${serverApi}ChatMessages`;
        if (input.ChatMessageId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}ChatMessages(${input.ChatMessageId})`;
        } else if (input.ChatMessageId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}ChatMessages(${input.ChatMessageId})`;
        }

        delete input['ChatMessageId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.ChatMessageId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Chatrooms */

const GetChatroomsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Chatrooms/$count`;
        if (query) url = `${serverApi}Chatrooms/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetChatroomsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Chatrooms`;
        if (query) url = `${serverApi}Chatrooms?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetChatroomSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Chatrooms(${id})`;
        if (params) {
            url = `${serverApi}Chatrooms(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetChatroomSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.ChatroomId;
        let method = "POST";
        let url = `${serverApi}Chatrooms`;
        if (input.ChatroomId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Chatrooms(${input.ChatroomId})`;
        } else if (input.ChatroomId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Chatrooms(${input.ChatroomId})`;
        }

        delete input['ChatroomId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.ChatroomId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   							// For Nested APIs
			/* $navPropName */

const SetChatroomChatsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, ChatroomId, ChatMessageId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}ChatroomChatss`;
        let data = { ChatMessageId, ChatroomId: ChatroomId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}ChatroomChatss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}ChatroomChatss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetChatroomChatsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}ChatroomChatss?$filter=ChatroomId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        		
	
	    
	 	
	
		
/* Patients */

const GetPatientsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Patients/$count`;
        if (query) url = `${serverApi}Patients/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetPatientsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Patients`;
        if (query) url = `${serverApi}Patients?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPatientSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Patients(${id})`;
        if (params) {
            url = `${serverApi}Patients(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetPatientSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.PatientId;
        let method = "POST";
        let url = `${serverApi}Patients`;
        if (input.PatientId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Patients(${input.PatientId})`;
        } else if (input.PatientId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Patients(${input.PatientId})`;
        }

        delete input['PatientId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PatientId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   							// For Nested APIs
			/* $navPropName */

const SetPatientAppointmentsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, PatientId, AppointmentId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}PatientAppointmentss`;
        let data = { AppointmentId, PatientId: PatientId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}PatientAppointmentss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}PatientAppointmentss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPatientAppointmentsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}PatientAppointmentss?$filter=PatientId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetPatientChatroomsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, PatientId, ChatroomId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}PatientChatroomss`;
        let data = { ChatroomId, PatientId: PatientId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}PatientChatroomss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}PatientChatroomss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPatientChatroomsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}PatientChatroomss?$filter=PatientId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        		
	
	    
	 	
	
		
/* Doctors */

const GetDoctorsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Doctors/$count`;
        if (query) url = `${serverApi}Doctors/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetDoctorsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Doctors`;
        if (query) url = `${serverApi}Doctors?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Doctors(${id})`;
        if (params) {
            url = `${serverApi}Doctors(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetDoctorSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.DoctorId;
        let method = "POST";
        let url = `${serverApi}Doctors`;
        if (input.DoctorId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Doctors(${input.DoctorId})`;
        } else if (input.DoctorId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Doctors(${input.DoctorId})`;
        }

        delete input['DoctorId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DoctorId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   							// For Nested APIs
			/* $navPropName */

const SetDoctorQualificationsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, QualificationId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorQualificationss`;
        let data = { QualificationId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorQualificationss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorQualificationss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorQualificationsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorQualificationss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetDoctorPatientAppointmentsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, AppointmentId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorPatientAppointmentss`;
        let data = { AppointmentId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorPatientAppointmentss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorPatientAppointmentss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorPatientAppointmentsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorPatientAppointmentss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   	   							// For Nested APIs
			/* $navPropName */

const SetDoctorAvailabilitiesJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, SlotId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorAvailabilitiess`;
        let data = { SlotId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorAvailabilitiess(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorAvailabilitiess(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorAvailabilitiesJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorAvailabilitiess?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetDoctorPaymentsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, PaymentId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorPaymentss`;
        let data = { PaymentId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorPaymentss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorPaymentss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorPaymentsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorPaymentss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetDoctorDoctorChatroomsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, ChatroomId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorDoctorChatroomss`;
        let data = { ChatroomId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorDoctorChatroomss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorDoctorChatroomss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorDoctorChatroomsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorDoctorChatroomss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetDoctorCertificationsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, DocId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorCertificationss`;
        let data = { DocId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorCertificationss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorCertificationss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorCertificationsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorCertificationss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetDoctorWeeklyScheduleByDaysJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DoctorId, WeekdayId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}DoctorWeeklyScheduleByDayss`;
        let data = { WeekdayId, DoctorId: DoctorId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}DoctorWeeklyScheduleByDayss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}DoctorWeeklyScheduleByDayss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDoctorWeeklyScheduleByDaysJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}DoctorWeeklyScheduleByDayss?$filter=DoctorId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   		
	
	    
	 	
	
		
/* Reviews */

const GetReviewsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Reviews/$count`;
        if (query) url = `${serverApi}Reviews/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetReviewsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Reviews`;
        if (query) url = `${serverApi}Reviews?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetReviewSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Reviews(${id})`;
        if (params) {
            url = `${serverApi}Reviews(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetReviewSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.ReviewId;
        let method = "POST";
        let url = `${serverApi}Reviews`;
        if (input.ReviewId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Reviews(${input.ReviewId})`;
        } else if (input.ReviewId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Reviews(${input.ReviewId})`;
        }

        delete input['ReviewId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.ReviewId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   		
	
	    
           
 	
     


/* Document */ 
const SetDocumentSingleMedia = async (input, headers) => {     return new Promise(async (resolve) => {
        let id = headers.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
                                                                delete headers['DocId'];
        delete headers['Deleted'];

        const formData = new FormData();
        formData.append('file', input);

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: formData,
                headers: {
                    ...headers, ...token
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetDocumentSingleMedia = async (id, value, type) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (value) {
            url = `${serverApi}Documents(${id})/$value`;
        }

        let headers = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers
            });

            if (res.status === 200) {
                let data = null;
                if (value) {
                    data = await res.text();
                    if (!Helper.IsNullValue(data)) {
                        if (data.startsWith("data:")) {
                            data = data.substring(data.indexOf('data:'));
                        } else {
                            let tmp = data.split('\r\n');
                            for (let img of tmp) {
                                if (img.startsWith("data:")) data = img;
                            }
                        }
                    }
                    return resolve({ status: res.ok, values: data });
                }
                data = await res.json();
                return resolve({ status: res.ok, values: data });
            }
            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

     
	        	
	
	
	    
	 	
	
		
/* Notifications */

const GetNotificationsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Notifications/$count`;
        if (query) url = `${serverApi}Notifications/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetNotificationsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Notifications`;
        if (query) url = `${serverApi}Notifications?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetNotificationSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Notifications(${id})`;
        if (params) {
            url = `${serverApi}Notifications(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetNotificationSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.NotificationId;
        let method = "POST";
        let url = `${serverApi}Notifications`;
        if (input.NotificationId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Notifications(${input.NotificationId})`;
        } else if (input.NotificationId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Notifications(${input.NotificationId})`;
        }

        delete input['NotificationId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.NotificationId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Specialties */

const GetSpecialtiesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Specialties/$count`;
        if (query) url = `${serverApi}Specialties/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetSpecialtiesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Specialties`;
        if (query) url = `${serverApi}Specialties?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetSpecialtySingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Specialties(${id})`;
        if (params) {
            url = `${serverApi}Specialties(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetSpecialtySingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.DocSpeId;
        let method = "POST";
        let url = `${serverApi}Specialties`;
        if (input.DocSpeId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Specialties(${input.DocSpeId})`;
        } else if (input.DocSpeId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Specialties(${input.DocSpeId})`;
        }

        delete input['DocSpeId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocSpeId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   							// For Nested APIs
			/* $navPropName */

const SetSpecialtyAvailableDocsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, DocSpeId, DoctorId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}SpecialtyAvailableDocss`;
        let data = { DoctorId, DocSpeId: DocSpeId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}SpecialtyAvailableDocss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}SpecialtyAvailableDocss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetSpecialtyAvailableDocsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}SpecialtyAvailableDocss?$filter=DocSpeId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   		
	
	    
	 	
	
		
/* Clinics */

const GetClinicsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Clinics/$count`;
        if (query) url = `${serverApi}Clinics/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetClinicsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Clinics`;
        if (query) url = `${serverApi}Clinics?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetClinicSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Clinics(${id})`;
        if (params) {
            url = `${serverApi}Clinics(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetClinicSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.ClinicId;
        let method = "POST";
        let url = `${serverApi}Clinics`;
        if (input.ClinicId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Clinics(${input.ClinicId})`;
        } else if (input.ClinicId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Clinics(${input.ClinicId})`;
        }

        delete input['ClinicId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.ClinicId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   							// For Nested APIs
			/* $navPropName */

const SetClinicDoctorsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, ClinicId, DoctorId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}ClinicDoctorss`;
        let data = { DoctorId, ClinicId: ClinicId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}ClinicDoctorss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}ClinicDoctorss(${Id})`;
        }
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetClinicDoctorsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}ClinicDoctorss?$filter=ClinicId eq ${idValue}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        		
	
	    
	 	
	
		
/* Weekdays */

const GetWeekdaysCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Weekdays/$count`;
        if (query) url = `${serverApi}Weekdays/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetWeekdaysMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Weekdays`;
        if (query) url = `${serverApi}Weekdays?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetWeekdaySingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Weekdays(${id})`;
        if (params) {
            url = `${serverApi}Weekdays(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetWeekdaySingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.WeekdayId;
        let method = "POST";
        let url = `${serverApi}Weekdays`;
        if (input.WeekdayId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Weekdays(${input.WeekdayId})`;
        } else if (input.WeekdayId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Weekdays(${input.WeekdayId})`;
        }

        delete input['WeekdayId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.WeekdayId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Qualifications */

const GetQualificationsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Qualifications/$count`;
        if (query) url = `${serverApi}Qualifications/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetQualificationsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Qualifications`;
        if (query) url = `${serverApi}Qualifications?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetQualificationSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Qualifications(${id})`;
        if (params) {
            url = `${serverApi}Qualifications(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetQualificationSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.QualificationId;
        let method = "POST";
        let url = `${serverApi}Qualifications`;
        if (input.QualificationId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Qualifications(${input.QualificationId})`;
        } else if (input.QualificationId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Qualifications(${input.QualificationId})`;
        }

        delete input['QualificationId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.QualificationId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Payments */

const GetPaymentsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Payments/$count`;
        if (query) url = `${serverApi}Payments/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetPaymentsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Payments`;
        if (query) url = `${serverApi}Payments?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPaymentSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Payments(${id})`;
        if (params) {
            url = `${serverApi}Payments(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetPaymentSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.PaymentId;
        let method = "POST";
        let url = `${serverApi}Payments`;
        if (input.PaymentId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Payments(${input.PaymentId})`;
        } else if (input.PaymentId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Payments(${input.PaymentId})`;
        }

        delete input['PaymentId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PaymentId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   		
	
	    
	 	
	
		
/* LabTests */

const GetLabTestsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}LabTests/$count`;
        if (query) url = `${serverApi}LabTests/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetLabTestsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}LabTests`;
        if (query) url = `${serverApi}LabTests?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetLabTestSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}LabTests(${id})`;
        if (params) {
            url = `${serverApi}LabTests(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetLabTestSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.LabTestId;
        let method = "POST";
        let url = `${serverApi}LabTests`;
        if (input.LabTestId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}LabTests(${input.LabTestId})`;
        } else if (input.LabTestId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}LabTests(${input.LabTestId})`;
        }

        delete input['LabTestId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.LabTestId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Slots */

const GetSlotsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Slots/$count`;
        if (query) url = `${serverApi}Slots/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetSlotsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Slots`;
        if (query) url = `${serverApi}Slots?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetSlotSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Slots(${id})`;
        if (params) {
            url = `${serverApi}Slots(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetSlotSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.SlotId;
        let method = "POST";
        let url = `${serverApi}Slots`;
        if (input.SlotId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Slots(${input.SlotId})`;
        } else if (input.SlotId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Slots(${input.SlotId})`;
        }

        delete input['SlotId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.SlotId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   		
	
	    
	 	
	
		
/* PrescribedItems */

const GetPrescribedItemsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}PrescribedItems/$count`;
        if (query) url = `${serverApi}PrescribedItems/$count?${query}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetPrescribedItemsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}PrescribedItems`;
        if (query) url = `${serverApi}PrescribedItems?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetPrescribedItemSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}PrescribedItems(${id})`;
        if (params) {
            url = `${serverApi}PrescribedItems(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        let token = await session.GetHeader();
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetPrescribedItemSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.PrescribedItemId;
        let method = "POST";
        let url = `${serverApi}PrescribedItems`;
        if (input.PrescribedItemId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}PrescribedItems(${input.PrescribedItemId})`;
        } else if (input.PrescribedItemId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}PrescribedItems(${input.PrescribedItemId})`;
        }

        delete input['PrescribedItemId'];
        delete input['Deleted'];

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: token,
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PrescribedItemId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
 


// Below is a reference function - a possible business logic for ecom reference app
const GetProductStatus = async (productId) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings?$filter=ProductId eq ${productId}`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                let _tmp = { Status: '' };
                if (json.value && json.value.length > 0) {
                    _tmp = json.value[0];
                }
                return resolve({ status: res.ok, values: _tmp });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}




const GetMetaData = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}$metadata`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });
            if (res.status === 200) {
                const values = await res.text();
                return resolve({ status: res.ok, values });
            }

            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Prodict List View Details */
const GetProductOnBoardings = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings`;

        let token = await session.GetHeader();
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: token,
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
/* Chats */
const GetChatMessages = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${chat_URL}getMessages`;
        if (query) url = `${chat_URL}getMessages?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let headers = await session.GetHeader();

        try {
            const res = await fetch(url, {
                method: "GET",
                headers
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SendChatMessage = async (input) => {     return new Promise(async (resolve) => {
        let method = "POST";
        let url = `${chat_URL}send`;

        let headers = await session.GetHeader();

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                 headers
            });

            if (res.status === 200) {
                const json = await res.json();
                return resolve({ status: res.ok });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetChatTargets = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${chat_URL}conversations`;
        if (query) url = `${chat_URL}conversations?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        let headers = await session.GetHeader();

        try {
            const res = await fetch(url, {
                method: "GET",
                headers
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const MarkRead = async (input) => {     return new Promise(async (resolve) => {
        let method = "PATCH";
        let url = `${chat_URL}markRead`;

        let headers = await session.GetHeader();

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                 headers
            });

            if (res.status === 200) {
                const json = await res.json();
                return resolve({ status: res.ok });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetStatus = async (input) => {     return new Promise(async (resolve) => {
        let method = "POST";
        let url = `${chat_URL}status`;

        let headers = await session.GetHeader();

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                 headers
            });

            if (res.status === 200) {
                const json = await res.json();
                return resolve({ status: res.ok, values: json });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

export {
 GetEntityInfo, GenerateOTP, VerifyOTP, SignupUser, LoginUser, ResetPassword, ForgotPassword, GetPrescriptionsCount, GetPrescriptionsMulti, GetPrescriptionSingle, SetPrescriptionSingle, SetPrescriptionItemsJoin, GetPrescriptionItemsJoin, SetPrescriptionLabTestsJoin, GetPrescriptionLabTestsJoin, GetAvailabilitiesCount, GetAvailabilitiesMulti, GetAvailabilitySingle, SetAvailabilitySingle, SetAvailabilitySlotsJoin, GetAvailabilitySlotsJoin, GetAppointmentsCount, GetAppointmentsMulti, GetAppointmentSingle, SetAppointmentSingle, SetAppointmentDocumentsJoin, GetAppointmentDocumentsJoin, SetAppointmentRemindersJoin, GetAppointmentRemindersJoin, GetRemindersCount, GetRemindersMulti, GetReminderSingle, SetReminderSingle, GetSpecialtyCategoriesCount, GetSpecialtyCategoriesMulti, GetSpecialtyCategorySingle, SetSpecialtyCategorySingle, GetChatMessagesCount, GetChatMessagesMulti, GetChatMessageSingle, SetChatMessageSingle, GetChatroomsCount, GetChatroomsMulti, GetChatroomSingle, SetChatroomSingle, SetChatroomChatsJoin, GetChatroomChatsJoin, GetPatientsCount, GetPatientsMulti, GetPatientSingle, SetPatientSingle, SetPatientAppointmentsJoin, GetPatientAppointmentsJoin, SetPatientChatroomsJoin, GetPatientChatroomsJoin, GetDoctorsCount, GetDoctorsMulti, GetDoctorSingle, SetDoctorSingle, SetDoctorQualificationsJoin, GetDoctorQualificationsJoin, SetDoctorPatientAppointmentsJoin, GetDoctorPatientAppointmentsJoin, SetDoctorAvailabilitiesJoin, GetDoctorAvailabilitiesJoin, SetDoctorPaymentsJoin, GetDoctorPaymentsJoin, SetDoctorDoctorChatroomsJoin, GetDoctorDoctorChatroomsJoin, SetDoctorCertificationsJoin, GetDoctorCertificationsJoin, SetDoctorWeeklyScheduleByDaysJoin, GetDoctorWeeklyScheduleByDaysJoin, GetReviewsCount, GetReviewsMulti, GetReviewSingle, SetReviewSingle, SetDocumentSingleMedia, GetDocumentSingleMedia, GetNotificationsCount, GetNotificationsMulti, GetNotificationSingle, SetNotificationSingle, GetSpecialtiesCount, GetSpecialtiesMulti, GetSpecialtySingle, SetSpecialtySingle, SetSpecialtyAvailableDocsJoin, GetSpecialtyAvailableDocsJoin, GetClinicsCount, GetClinicsMulti, GetClinicSingle, SetClinicSingle, SetClinicDoctorsJoin, GetClinicDoctorsJoin, GetWeekdaysCount, GetWeekdaysMulti, GetWeekdaySingle, SetWeekdaySingle, GetQualificationsCount, GetQualificationsMulti, GetQualificationSingle, SetQualificationSingle, GetPaymentsCount, GetPaymentsMulti, GetPaymentSingle, SetPaymentSingle, GetLabTestsCount, GetLabTestsMulti, GetLabTestSingle, SetLabTestSingle, GetSlotsCount, GetSlotsMulti, GetSlotSingle, SetSlotSingle, GetPrescribedItemsCount, GetPrescribedItemsMulti, GetPrescribedItemSingle, SetPrescribedItemSingle, GetProductStatus, GetMetaData, GetProductOnBoardings,
 GetChatMessages, SendChatMessage, GetChatTargets, MarkRead, GetStatus
};
