import {Star} from 'lucide-react'
function Ratings({stars} : {stars: number}) {
    return (
        <div className='flex mx-auto gap-x-1'>
            <Star className={`${stars >= 1 ? "fill-[#FFD233]" : ""}`}/>
            <Star className={`${stars >= 2 ? "fill-[#FFD233]" : ""}`}/>
            <Star className={`${stars >= 3 ? "fill-[#FFD233]" : ""}`}/>
            <Star className={`${stars >= 4 ? "fill-[#FFD233]" : ""}`}/>
            <Star className={`${stars >= 5 ? "fill-[#FFD233]" : ""}`}/>
        </div>
    )
}

export default Ratings