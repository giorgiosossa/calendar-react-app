"use client"

interface WelcomeCardProps {
  userName?: string
  greeting?: string
  date?: string
  showLogo?: boolean
}

export default function WelcomeCard({
  userName = "Isabella Martinez",
  greeting = "HOLA",
  date = "Last Update Monday, 16 Jul",
  showLogo = true,
}: WelcomeCardProps) {
  return (
    <div className="bg-white  p-2 mt-3 w-100vw h-[130px] mx-auto border-b-1">
      <div className="flex items-start justify-between">
        {/* Left side - Greeting and Name */}
        <div className="flex-1 w-2/3">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-2">{greeting}</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        </div>

        {/* Right side - Date and Logo aquí debe ir el logo de CLARA es el swithc para prender o apagar a ia */}
        <div className="flex flex-col items-end w-1/3 pr-7 place-self-center">
        
          {showLogo && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div> 
            </div>
          )}
         
        </div>
      </div>
    </div>
  )
}
