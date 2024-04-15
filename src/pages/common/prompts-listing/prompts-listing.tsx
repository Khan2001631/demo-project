
import UserCard from "../../../components/common/user-card/user-card";
import PromptLibrary from "../../../components/common/prompt-library/prompt-library";
import Statistics from "../../../components/common/statistics/statistics";
import MyApplications from "../../../components/common/my-applications/my-applications";
import WelcomeNote from "../../../components/secure/modals/welcome-note";

const PromptsListing = () => {
  const user = JSON.parse(localStorage.getItem('user') as string);
  const showWelcomeNote = user?.showWelcomeNote;
  
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="order-2 order-md-1 col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-3">
            <div className="row">
              <div className="order-2 order-md-1 col-md-12">
                <div className="mb-3">
                  <UserCard />
                </div>
              </div>
              <div className="order-1 order-md-2 col-md-12">
                <div className="mb-3">
                  <MyApplications accountType="user" id="home_myApplication"/>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 order-md-2 col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-3">
            <PromptLibrary id="home_promptLibrary" libraryType="personal" />
          </div>
          <div className="order-3 order-md-3 col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <Statistics id="home_analytics" statsType="prompt" />
          </div>
        </div>
      </div>
      <WelcomeNote id="welcomeNoteModal" showWelcomeNote={showWelcomeNote} />
    </>
  )
}
export default PromptsListing;