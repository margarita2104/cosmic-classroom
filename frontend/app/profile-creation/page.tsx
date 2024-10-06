export default function ProfileCreation() {
    return (
        <main>
            <form className="flex flex-col gap-8">
                <div className="grid sm:grid-cols-2 gap-8 mt-12">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="">Verification code</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="">Email</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="">First name</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="">Last name</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="">Password</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="">Password repeat</label>
                        <input type="text" className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900" />
                    </div>
                </div>              

                <button type="submit" className="btn-yellow w-min self-center">Submit</button>
            </form>
        </main>
    )
}