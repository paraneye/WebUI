//project 화면에서의 Menu
ElementMenu = {
    Project :  [
        menu = { Name : "Overview", Icon : "", Link : "../../modules/project/#project", Desc : "", menus : [] }, 
        menu = { Name : "Data", Icon : "", Link : "", Desc : "",
            menus : [
                menu = { Name : "Drawings", Icon : "s-icon-drawings", Link : "../../modules/mto/#managedrawinglist", Desc : "" }, 
                menu = { Name : "Schedule", Icon : "s-icon-calendar", Link : "../../modules/project/#importedschedulelist", Desc : "" },
                menu = { Name : "MTO", Icon : "s-icon-mto", Link : "../../modules/mto/#mtoview", Desc : "" },
                menu = { Name : "Import MTO", Icon : "s-icon-import-mto", Link : "../../modules/mto/#importmtolist", Desc : "" },
                menu = { Name : "Cost Code Assignment", Icon : "s-icon-assign-costcode", Link : "../../modules/mto/#assigncostcodelist", Desc : "" }
            ]
        },
        menu = { Name : "Document Control", Icon : "", Link : "", Desc : "",
            menus : [
                menu = { Name : "Document Library", Icon : "s-icon-document-control-94", Link : "../../modules/project/#documentlist", Desc : "" }, 
                menu = { Name : "Form Library", Icon : "s-icon-library-form", Link : "../../modules/project/#formlist", Desc : "" },
                menu = { Name : "Reports and Records", Icon : "s-icon-report-records", Link : "../../modules/project/#reportlist", Desc : "" }
            ]
        },
        menu = { Name : "Tools", Icon : "", Link : "", Desc : "",
            menus : [
                menu = { Name : "Drawing Viewer", Icon : "s-icon-drawing-viewer", Link : "../../modules/mto/#drawings", Desc : "" }
                //menu = { Name : "IWP Viewer", Icon : "s-icon-iwp-viewer", Link : "../../modules/mto/#iwpviewerlist", Desc : "" }
            ]
        },
        menu = { Name : "Settings", Icon : "", Link : "", Desc : "",
            menus : [
                menu = { Name : "Infomation", Icon : "s-icon-information", Link : "../../modules/project/#infomation", Desc : "" }, 
                menu = { Name : "Human Resources", Icon : "s-icon-manage-personnel", Link : "../../modules/project/#hrlist", Desc : "" }, 
                menu = { Name: "Members", Icon : "s-icon-admin", Link: "../../modules/project/#members", Desc: "" },
                menu = { Name : "Cost Code Estimates", Icon : "s-icon-costcode-estimates", Link : "../../modules/project/#costcodelist", Desc : "" },
                menu = { Name : "Map Client Cost Codes", Icon : "s-icon-costcode-map-client", Link : "../../modules/project/#costcodemaplist", Desc : "" },
                menu = { Name : "CWA/CWP", Icon : "s-icon-cwp", Link : "../../modules/project/#cwacwplist", Desc : "" }
            ]
        }
    ],
    GlobalSetting :  [
        menu = { Name : "Users", Link : "../../modules/global/#userlist", Desc : "", menus : [] }, 
        menu = { Name : "Roles & Permissions", Link : "../../modules/global/#rolelist", Desc : "", menus : [] }, 
        menu = { Name : "Companies", Link : "../../modules/global/#companylist", Desc : "", menus : [] }, 
        menu = { Name : "Library", Link : "", Desc : "",
            menus : [
                menu = { Name: "Material", Link: "../../modules/mto/#materiallist", Desc: "" },
                menu = { Name: "Consumable Material", Link: "../../modules/mto/#consumablemateriallist", Desc: "" },
                menu = { Name : "Equipment", Link : "../../modules/mto/#equipmentlist", Desc : "" }
            ]
        },
        menu = { Name : "Common Codes", Link : "", Desc : "",
            menus : [
                menu = { Name : "Drawing Type", Link : "../../modules/mto/#drawingtypelist", Desc : "" }, 
                menu = { Name : "Progress Type", Link : "../../modules/mto/#progresstypelist", Desc : "" },
                menu = { Name : "Task Category and Type", Link : "../../modules/mto/#taskcategory", Desc : "" },
                menu = { Name : "CostCode", Link : "../../modules/global/#costcodelist", Desc : "" },
                menu = { Name: "Dev - ExceptionLog", Link: "../../modules/global/#sigmaloglist", Desc: "" },
                menu = { Name: "Dev - CodeCategory", Link: "../../modules/global/#sigmacodecategorylist", Desc: "" },
                menu = { Name: "Dev - SigmaCode", Link: "../../modules/global/#sigmacodelist", Desc: "" },
                menu = { Name: "Dev - SigmaJob", Link: "../../modules/global/#sigmajoblist", Desc: "" }
            ]
        }
    ]
}
