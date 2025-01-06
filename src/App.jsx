import Navbar from "./components/Navbar"
import Spacebar from "./components/Spacebar"
import LayoutCard from "./components/LayoutCard"
import QnaPopup from "./components/QnaPopup"
function App() {
  return (
    <div>
      <Navbar/>
      <Spacebar/>
      <LayoutCard/>
      <QnaPopup  question="is the flooring project for residental purpose ?"/>
    </div>
  )
}

export default App
