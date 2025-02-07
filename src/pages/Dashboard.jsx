import { RiDashboardFill } from "react-icons/ri";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
const percentage = 66;

function Dashboard() {
  return (
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-y-hidden">
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
        <div className="h-screen max-w-sm  sticky left-0 top-0 bottom-0">
          {/* logo */}
          <div className="cursor-pointer flex justify-center items-center">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* main */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">client</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for content */}
          <div className="flex-1  border-2 border-[#000] rounded-3xl ">
            {/* for dashboard */}
            <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] py-2 px-3">
              {/* dashboard area layout */}
              <div className="p-4">
                <h2 className="capitalize font-bold mb-2">
                  Layout Information
                </h2>
                {/* div containing information */}
                <div className="flex gap-10">
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* dashboard boq part */}

              <div className="p-3">
                <h3 className="capitalize font-bold ">BOQ generated</h3>

                {/* boq card */}
                <div className="rounded-3xl border-2 border-[#ccc] max-w-sm p-2">
                  <div className="flex justify-end gap-2 p-2">
                    <MdOutlineModeEdit size={30} />
                    <MdDeleteOutline size={30} />
                  </div>
                  <div>
                    <h3 className="font-bold">Lorem, ipsum.</h3>
                  </div>
                </div>

                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    // styles={{ width: 50, height: 50 }}
                    styles={buildStyles({
                      // Rotation of path and trail, in number of turns (0-1)
                      rotation: 0.25,

                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: "butt",

                      // Text size
                      textSize: "16px",

                      // How long animation takes to go from one percentage to another, in seconds
                      pathTransitionDuration: 0.5,

                      // Can specify path transition in more detail, or remove it entirely
                      // pathTransition: 'none',

                      // Colors
                      pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                      textColor: "#f88",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#3e98c7",
                    })}
                  />
                </div>
              </div>
              <div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Magni quos fugiat reiciendis temporibus nulla eius maxime
                  quidem? Libero eum laborum ut, dolorum corrupti autem
                  voluptate, aspernatur beatae rerum doloremque esse excepturi
                  facilis officia neque illum sed atque amet qui perspiciatis
                  eligendi unde pariatur corporis modi. Doloribus unde
                  repellendus repudiandae, et ipsa dicta itaque, quasi vel fugit
                  deserunt possimus, amet nobis esse deleniti excepturi optio
                  sequi voluptates. Distinctio officia sequi explicabo rerum
                  quam facilis dolores repellat ipsa, fugit dolorem tenetur
                  molestias, laudantium labore aliquid. Quidem veritatis
                  consequatur illum itaque quae similique voluptate nostrum
                  alias corporis facere reprehenderit omnis soluta animi maiores
                  vitae laudantium dolore fugit molestias adipisci odit, ullam
                  harum eius! Quisquam, ratione animi amet voluptatum
                  voluptatibus id eligendi adipisci architecto tenetur numquam
                  cum asperiores illum beatae? Suscipit quos vitae, incidunt
                  soluta neque laudantium in ipsum similique quis repudiandae
                  esse ipsam inventore, ullam deserunt consectetur quasi quidem
                  nulla pariatur quas! Voluptatum quas, ullam et explicabo
                  assumenda, dignissimos error a obcaecati nisi corrupti eaque!
                  Obcaecati aut recusandae accusamus corporis fugiat deserunt
                  maxime consequatur molestias nobis beatae optio voluptas vero
                  dolore perspiciatis repellendus et ut tenetur quis dolores,
                  fugit possimus amet distinctio ducimus. Quia ipsum debitis
                  veniam. Nihil soluta in beatae vel ab, est quos perferendis
                  harum veniam. Aliquid neque iusto aspernatur cumque, corporis
                  quos mollitia amet corrupti vero enim, ad possimus rem veniam
                  optio. Velit illum unde eius veritatis sit provident ipsum
                  assumenda libero maxime dolorum, dicta labore corporis amet
                  quisquam optio rem tenetur iste mollitia quia voluptate?
                  Voluptas voluptates ab cupiditate alias eius voluptatibus
                  accusamus, nisi modi nemo repellendus, iste quod velit
                  blanditiis earum corporis, temporibus id. Odit dolore quod,
                  asperiores ipsa aspernatur unde maiores. Assumenda architecto
                  tempora eligendi ex minus modi reprehenderit corporis, quod
                  doloribus itaque in quibusdam perferendis? Molestiae
                  temporibus suscipit nam cupiditate, doloribus placeat. Nemo
                  doloribus pariatur, distinctio corrupti nisi maiores sint
                  consectetur ducimus iure cumque suscipit in, magnam
                  reprehenderit aut officiis, facere mollitia eius quasi odio
                  nesciunt delectus earum culpa labore. Maiores, corrupti.
                  Delectus, odit laboriosam quas dignissimos, similique fuga
                  corrupti labore illum maxime repellendus voluptatum. Accusamus
                  neque architecto aliquid harum inventore! Molestiae beatae
                  esse eos quidem dolore quod animi autem magnam nobis assumenda
                  eaque aperiam dolorem dolores quos, delectus repellendus
                  molestias alias commodi expedita accusamus laborum magni est
                  exercitationem veritatis. Perspiciatis odio officiis tempora
                  exercitationem molestias sed cum porro voluptas a facilis
                  asperiores, magni autem eaque quisquam similique, quod
                  explicabo dicta, voluptates suscipit incidunt at amet.
                  Consectetur mollitia sapiente aspernatur, delectus expedita
                  illum repellendus voluptates qui voluptas molestias soluta
                  quisquam sint quas provident culpa sequi eius fugiat?
                  Molestiae in quis optio cupiditate ipsam repudiandae
                  dignissimos veritatis voluptas quidem, dolore, magnam
                  obcaecati illum voluptate voluptates qui numquam enim dolor
                  temporibus eum praesentium rem? Expedita doloremque incidunt
                  id, temporibus consequatur quod debitis, officiis accusantium
                  fuga soluta accusamus minus ipsa recusandae ipsum? Sunt ullam
                  ab minima dicta maxime impedit eos assumenda autem vero
                  repellendus fugit nesciunt accusantium, cupiditate
                  reprehenderit asperiores dolorem deserunt fugiat officia
                  laborum a voluptatem sapiente! Minima tempore vero praesentium
                  distinctio sequi asperiores labore explicabo quasi, placeat
                  eos accusamus numquam et architecto temporibus corrupti hic
                  aliquam ducimus quae! Totam reprehenderit deleniti nesciunt
                  illo vitae voluptate perferendis facilis tenetur nemo odio
                  beatae, nostrum magnam illum minus cumque maiores. Aut vitae
                  officiis adipisci alias provident quia architecto inventore,
                  ad reprehenderit esse possimus velit, voluptates fuga animi
                  perferendis quaerat deserunt quidem, nostrum illo quasi nemo
                  iusto maxime autem. Dicta quam, quis nostrum ex laborum,
                  architecto deserunt, unde quos iure quia aperiam voluptate
                  adipisci! Ipsa expedita, porro magnam architecto quo
                  cupiditate sint ducimus nobis eius eveniet tempora et in
                  incidunt consectetur voluptatibus quidem excepturi dolorem
                  deleniti commodi dolore asperiores? Dolores harum, illo
                  consequatur magni ad nisi porro magnam, qui, beatae earum
                  repellat quidem ab quod. Modi consequatur harum consequuntur
                  itaque temporibus ipsam corporis non optio quae accusamus ex
                  ad perspiciatis, quis esse nisi minima numquam minus quam
                  officia assumenda libero earum! Assumenda, dolores saepe cum
                  dolorum culpa natus necessitatibus nobis quaerat nihil, vel
                  pariatur? Placeat, dicta maxime. Magnam animi suscipit
                  exercitationem quisquam placeat consequuntur, hic error ab
                  repellat eum inventore eius labore soluta ullam, at delectus
                  tempora aut excepturi. Rem natus tempore fugiat voluptate cum,
                  ipsum dolor fuga. Error, iure voluptas deserunt nam vero
                  numquam tempore ducimus possimus et maxime architecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
