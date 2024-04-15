import { useEffect, useState } from "react";
import Card from "../../common/card/card";
import { useUpdateModelMutation } from "../../../api-integration/secure/secure";
import { useDispatch } from "react-redux";
import { fullPageLoader } from "../../../api-integration/commonSlice";
import Pagination from "../../common/pagination/pagination";
import Settings from '../../../assets/icons/settings.svg';
import TooltipComponent from "../../common/bootstrap-component/tooltip-component";
import ManageModel from "../modals/manage-model";

type ModelUser = {
    CUSTOMMODELID: number;
    MODELDISPLAYNAME: string;
    MODELDESCRIPTION: string;
    MODELACCESSIBILITY: string;
    MODELORGID: string;
};

const ModelListing:React.FC = ({}) =>
{
    const dispatch = useDispatch();
    const manageModelId = "manageModel"

    const [currentUser, setCurrentUser] = useState<ModelUser | null>(null);
    const [reloadComponent, setReloadComponent] = useState<boolean>(false);

    const [newUser, setNewUser] = useState({
        CUSTOMMODELID: 0,
        MODELDISPLAYNAME: '',
        MODELDESCRIPTION: '',
        MODELACCESSIBILITY: '',
        MODELORGID: '',
    })
 
    // Pagination:
    const [modelCurrentPage, setModelCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [modelCurrentItems, setModelCurrentItems] = useState([]);

  
    const [getModelListAPI, { data: modelData, isLoading: isModelLoading, isSuccess: isModelSuccess, isError:isModelError, error:modelError }] =
    useUpdateModelMutation();

    useEffect(() => {
        dispatch(fullPageLoader(false))
        getModelListAPI({customModelId:"0"})      
        setReloadComponent(false)  
    },[reloadComponent])


    useEffect(() => {
        if(isModelSuccess || isModelError || modelError)
            dispatch(fullPageLoader(false))
    },[isModelSuccess, isModelError, modelError])
    
    useEffect(() => {
        if (Array.isArray(modelData?.customModelDetail)) {
            const indexOfLastModelItem = modelCurrentPage * itemsPerPage;
            const indexOfFirstModelItem = indexOfLastModelItem - itemsPerPage;
            setModelCurrentItems(modelData?.customModelDetail.slice(indexOfFirstModelItem, indexOfLastModelItem)as never[]);   
        }
    }, [modelData,isModelSuccess, modelCurrentPage, itemsPerPage, dispatch])

    const paginateModel = (pageNumber: number) => setModelCurrentPage(pageNumber);

    const handleSettingsClick = (user: ModelUser) => {
        setCurrentUser(user);
    }    

    return(
        <>
        <Card id="model" cardHeightClass={'h-100'}  like={false} share={false} help={true} helpTitle={"Custom Models"} helpContent={"Content coming soon..."} titleType={1} title={"Model Lists"} Feedback={true} logo={true}>
            <div className="table-responsive">
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Accessability</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modelData && (!modelCurrentItems || (modelCurrentItems.length === 0) ?
                            (
                                <tr>
                                    <td colSpan={6}>
                                    <p className="text-center mt-3">No records found...</p>                                                   
                                    </td>
                                </tr>
                            ) : (
                                modelCurrentItems.map((model: any, index: number) => (
                                    <tr key={index}>
                                        <td className="text-center">{model.CUSTOMMODELID}</td>
                                        <td className="text-center">{model.MODELDISPLAYNAME}</td>
                                        <td className="text-center">{model.MODELDESCRIPTION}</td>
                                        <td className="text-center">{model.MODELACCESSIBILITY}</td>
                                        <td className="text-center">{model.MODELORGID}</td>
                                        <td className="text-center">
                                        <TooltipComponent title="Edit button" >
                                            <img src={Settings} alt = "edit" className='h-1-5 cursor-pointer' 
                                                data-bs-toggle="modal"
                                                data-bs-target={`#${manageModelId}`}
                                                onClick={() =>handleSettingsClick(model)}
                                            />
                                        </TooltipComponent>
                                        </td>
                                    </tr>
                                ))
                            )
                            )}
                    </tbody>
                </table>
            </div>
            {isModelLoading && 
                <div className="text-center">
                    "Loading..."
                </div>
            }
             <div className="text-end ">
                <TooltipComponent title="Add Model" >
                    <button type="button"
                    className="btn btn-primary btn-md rounded-pill px-4"
                    data-bs-toggle="modal"
                    data-bs-target={`#${manageModelId}`}
                    onClick={() => handleSettingsClick(newUser)}
                    >Add Model</button>
                </TooltipComponent>
            </div>
           
            <div className="text-start">
                {isModelSuccess && modelData && modelData?.customModelDetail.length > 0 && 
                    <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={modelData?.customModelDetail.length}
                    paginate={paginateModel}
                    currentPage={modelCurrentPage}
                    pervNextNavFlag={true}
                    noOfLinksOnPage={10}
                    previousText="Previous"
                    nextText="Next"
                />
                }
            </div>
    </Card>
    <ManageModel id={manageModelId} currentUser = {currentUser} setReloadComponent={setReloadComponent}/>
    </>
    )
}

export default ModelListing;
