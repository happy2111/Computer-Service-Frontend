import {
  Award,
  CheckCircle,
  Clock,
  Shield,
  Star,
  PenToolIcon as Tool,
  Users,
} from "lucide-react";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/simpleApi.js";
import MastersSwiper from "./MastersSwiper.jsx";

export default function AboutUsSection() {
  const [masters, setMasters] = useState([]);

  const fetchMasters = async () => {
    try {
      const res = await api.get("masters/all");
      setMasters(res.data);
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  }

  useEffect(() => {
    fetchMasters()
  }, []);


  return (
    <div
      id="about"
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-4">
              ApplePark haqida
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ishonchli hamkoringiz —{" "}
              <span className="text-blue-600">Sifatli ta'mirlash</span>
            </h2>
            <p className="text-lg text-gray-600">
              15 yildan ortiq tajribaga ega bo'lgan jamoamiz sifatli xizmat,
              original ehtiyot qismlar va mijozlar roziligi asosida obro' qozongan.
              Bizning tariximiz va ApplePark jamoasi haqida ko'proq bilib oling.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Bizning tariximiz
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    2010-yilda tashkil etilgan ApplePark kichik smartfonlarni
                    ta'mirlash ustaxonasidan boshlangan. Maqsadimiz: yuqori
                    sifatli ta'mirlashni adolatli narxlarda va a'lo mijozlarga
                    xizmat ko'rsatish bilan ta'minlash.
                  </p>
                  <p>
                    Bir kishilik ish sifatida boshlangan kompaniyamiz hozirda
                    barcha turdagi raqamli qurilmalarni—smartfon, planshet, noutbuk
                    va kompyuterlarni ta'mirlashga ixtisoslashgan sertifikatlangan
                    mutaxassislar jamoasiga aylandi.
                  </p>
                  <p>
                    Yillar davomida xizmatlarimizga original Apple zaxira
                    qismlarini buyurtma asosida yetkazib berish, o‘rnatish,
                    iCloud ochish va boshqa zamonaviy xizmatlar ham qo‘shildi.
                    Endi biz texnologiya taʼmirlash bo‘yicha yagona yechim
                    taklif qilamiz.
                  </p>
                  <p>
                    Bugungi kunda ApplePark minglab mamnun mijozlarga xizmat
                    ko'rsatadi, mintaqada bir nechta filiallari va ta'mirlash
                    sohasida yuqori obro'ga ega.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src="https://www.pcgeeksusa.com/wp-content/uploads/2024/03/Computer-Repair.jpeg"
                    alt="ApplePark store interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-gray-900">15+ yil</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    ishonchli xizmat
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Bizning maqsad va qadriyatlarimiz
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ValueCard
                icon={<Star className="h-6 w-6 text-blue-600" />}
                title="Mukammallik"
                description="Har bir ta'mirlashda eng yuqori sifatli ehtiyot qismlar va eng yaxshi texnalogiyalardan foydalanamiz."
              />
              <ValueCard
                icon={<Shield className="h-6 w-6 text-blue-600" />}
                title="Halollik"
                description="Biz to'liq ochiqlik bilan ishlaymiz, barcha xizmatlarimiz uchun adolatli narx va halol baho beramiz."
              />
              <ValueCard
                icon={<Tool className="h-6 w-6 text-blue-600" />}
                title="Mutaxassislik"
                description="Bizning texniklarimiz sertifikatlangan va zamonaviy texnologiyalar bo'yicha doimiy bilimlarini oshirib boradilar."
              />
              <ValueCard
                icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
                title="Ishonchlilik"
                description="Har bir ta'mirlash uchun kafolat beramiz va mijozlarimiz roziligi biz uchun muhim."
              />
              <ValueCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Mijozlarga e'tibor"
                description="Mijozlarimizni birinchi o'ringa qo'yamiz: aniq muloqot, qulay xizmat va tezkor yordam ko'rsatamiz."
              />
              <ValueCard
                icon={<Award className="h-6 w-6 text-blue-600" />}
                title="Innovatsiya"
                description="Xizmatlarimiz va jarayonlarimizni doimiy takomillashtirib boramiz."
              />
            </div>
          </div>


          {/* Team Section */}
          <div className="mb-20 masters-swiper">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Mutaxassislarimiz bilan tanishing
            </h3>
            <MastersSwiper masters={masters}/>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Nima uchun ApplePark?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ReasonCard
                number="01"
                title="Sertifikatlangan mutaxassislar"
                description="Bizning ustalarimiz ko'p yillik tajribaga ega va doimiy ravishda bilimlarini oshirib boradilar."
              />
              <ReasonCard
                number="02"
                title="Sifatli ehtiyot qismlar"
                description="Barcha ta'mirlashlar uchun faqat yuqori sifatli, ishlab chiqaruvchi tomonidan tavsiya etilgan qismlardan foydalanamiz."
              />
              <ReasonCard
                number="03"
                title="90 kunlik kafolat"
                description="Barcha ta'mirlashlar uchun 90 kunlik kafolat beriladi (ehtiyot qismlar va ish uchun)."
              />
              <ReasonCard
                number="04"
                title="Tezkor xizmat"
                description="Ko'pchilik ta'mirlash ishlari bir kunda, ba'zida esa kutayotganingizda ham bajariladi."
              />
              <ReasonCard
                number="05"
                title="Shaffof narxlar"
                description="Hech qanday yashirin to'lovlar yo'q. Ish boshlanishidan oldin aniq narx aytiladi."
              />
              <ReasonCard
                number="06"
                title="Kafolatlangan mamnunlik"
                description="Agar xizmatimizdan to'liq mamnun bo'lmasangiz, muammoni hal qilamiz."
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Yutuqlarimiz
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <AchievementStat
                number="15+"
                label="Biznesdagi yillar"
              />
              <AchievementStat
                number="50,000+"
                label="Ta'mirlangan qurilmalar"
              />
              <AchievementStat
                number="98%"
                label="Mijozlar roziligi"
              />
              <AchievementStat
                number="2"
                label="Xizmat ko'rsatish nuqtalari"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Qurilmangizni ta'mirlashga tayyormisiz?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Bugunoq ApplePark farqini his eting. Bepul diagnostika uchun biz bilan
              bog'laning yoki qurilmangizni filiallarimizdan biriga olib keling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Biz bilan bog'laning
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Bizning xizmatlarimiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ValueCard({icon, title, description}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TeamMember({image, name, position, description}) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
      />
      <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
      <p className="text-blue-600 text-sm">{position}</p>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
  );
}

function ReasonCard({number, title, description}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <span className="text-blue-600 font-bold text-xl mb-2 block">
        {number}
      </span>
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function AchievementStat({number, label}) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600">{number}</div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
}
