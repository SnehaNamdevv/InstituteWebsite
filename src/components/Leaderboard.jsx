export default function Leaderboard(){

const students=[
"Lydia Iroko",
"Emmanuel Iroko",
"Beampe Adams",
"James Allen",
"Gloria Smith"
]

return(

<div className="bg-[#171A25] p-6 rounded-xl">

<h3 className="mb-4 font-semibold">
Leaderboard
</h3>

<div className="space-y-4">

{students.map((s,i)=>(

<div key={i} className="flex justify-between">

<span>{s}</span>

<span className="text-green-400">
97%
</span>

</div>

))}

</div>

</div>

)
}