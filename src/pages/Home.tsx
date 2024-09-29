import HomeBanner from '../assets/home.png';

const Home = () => {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-8">
      <div className="flex flex-col justify-center ps-20 gap-6">
        <h1 className="text-5xl font-semibold text-primary leading-tight">Transforming Technical Interviews into Opportunities!</h1>
        <h2 className="text-4xl font-semibold text-primary opacity-70">Platform with many features built-in.</h2>
        <p className='text-primary mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus eligendi porro iste neque, odit, sequi totam necessitatibus iure hic cumque repellat sed id libero molestiae! Enim ex atque nam repellendus iusto, aut quidem incidunt aperiam modi iure illo vel commodi unde earum, sint quod repudiandae eaque, magni laboriosam fuga labore?</p>
      </div>
      <div className="flex justify-center items-center">
        <img src={HomeBanner} alt="banner" className="rounded-md" />
      </div>
    </div>
  )
}

export default Home