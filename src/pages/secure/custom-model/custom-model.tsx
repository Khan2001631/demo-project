import UserCard from "../../../components/common/user-card/user-card";
import ModelListing from "../../../components/secure/model-listing/model-listing";

const CustomModel: React.FC = () => 
{
    return(
        <>
        <div className="container">
            <div className="row mb-4">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <div className="mb-3">
                        <UserCard/>
                    </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                   <div className="mb-3">
                        <ModelListing/>
                   </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default CustomModel;