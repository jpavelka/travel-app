import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  let tripDataRaw = `
  date,activity,miles,campground,city,elevation,nights,site,electric,sewer,laundry,showers,lat,lng,timezone,mapSearchExtra,mapSearchReplace,imageSrcs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, March 10, 2024",Driving,211,Panhandle Lodging RV Park,"Canyon, TX",3466,3,1,50A,Yes,Yes,Yes,34.9649238,-101.8832092,CDT (GMT-5),,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432428686_10113095612559525_6505499357361776403_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=FGXMHHLenJkQ7kNvgFAkJqK&_nc_ht=scontent-lax3-2.xx&oh=00_AYChPZ7YyULak2rggy9RjHnTMPn0hE1oS1bstp4LkVr0Mg&oe=664560EC,Restaurant near the campground,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Cadillac Ranch,,,"Amarillo, TX",,,,,,,,35.1872366,-101.9870486,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432431417_10113095613308025_6585472867798071799_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=5xCrflEj2dgQ7kNvgGnDaJ2&_nc_ht=scontent-lax3-2.xx&oh=00_AYBkIKpuPNMKAo_U5wQYxuEC9bBnsRx_HyH9LMByooYwQw&oe=66456F43,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/430614181_10113095613392855_6864375534765906391_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=K2DuFYpX6t4Q7kNvgEAag94&_nc_ht=scontent-lax3-1.xx&oh=00_AYB4VbpFNmGrAkA6jvmsY389ay7mbwMnZGycSHrjNyFnVw&oe=66456374,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/430685813_10113095613452735_8496347992459171750_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=R3dpAvZ3KNwQ7kNvgEXoaFd&_nc_ht=scontent-lax3-1.xx&oh=00_AYD7TW9UOYIxYELjSZO7zkIxDAmJvcD8bnFV0yF6Orflvg&oe=664570EC,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/430661414_10113095613552535_4294784926516564155_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C8Kuj9pQ_BoQ7kNvgEx2lfa&_nc_ht=scontent-lax3-1.xx&oh=00_AYDZLq2_o8DHEdnIPnVMJbqa66DkY5XcJHo90HGQXn0U2Q&oe=66455CFF,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432445003_10113095613238165_2684204550272121929_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=TugfPvbXbwkQ7kNvgE7LyoA&_nc_ht=scontent-lax3-2.xx&oh=00_AYCAJp7droArTbwHert4910ZIAI2ornTWyywsY-eTCFudA&oe=6645607F,-,,,,,,,,,,,,,,,,,,,,,,
,Palo Duro Canyon SP,,,,,,,,,,,34.9372503,-101.6589305,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/430727145_10113095612878885_2084308829151031453_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ui9Q48T3hHEQ7kNvgENoIe3&_nc_ht=scontent-lax3-1.xx&oh=00_AYAA1tUn0qNthnKHU6v83lmwIsQuaLqMSWirOgcTSMnCFQ&oe=66454BAE,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432415313_10113095613083475_7500582392788688710_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=PwNZw4vOWEkQ7kNvgHL03xM&_nc_ht=scontent-lax3-1.xx&oh=00_AYDT69tTGYHUXqXJczjFy6CSm03-uFAQAjNIS4enLIp0sA&oe=6645440D,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/430609482_10113095613163315_7282590292512173543_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=1pEcslua73AQ7kNvgGsiLwS&_nc_ht=scontent-lax3-2.xx&oh=00_AYAcw8-AkOZs1VxgH3kfSWz7Zv0XTT2nwC3kR7eWeM4oaw&oe=66455FF4,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432433509_10113095612789065_1518041845899230685_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qThN1Q0DYj8Q7kNvgGJBnU5&_nc_ht=scontent-lax3-1.xx&oh=00_AYAvpglwdP5kNKsfvhQBeIePHUFiWIE-_qwASiB0WwPJKg&oe=66456399,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432428641_10113095612983675_6477578651203149510_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KGLBX9ILnj0Q7kNvgFvYvUU&_nc_ht=scontent-lax3-2.xx&oh=00_AYDaLvquEjKeWwS-ghMD7BEdltubRJEAIqlB2jzZDEvyDQ&oe=664548C0,-,,,,,,,,,,,,,,,,,,,,,,
,Texas Air & Space Museum,,,"Amarillo, TX",,,,,,,,35.2134157,-101.7140016,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432434945_10113095611945755_817396651750245239_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2XpU59bmoUAQ7kNvgGaFgPX&_nc_oc=Adj8E--POQPCYatNtdnhERW0Q7f_ANoBTWS-pllVCMqNBGFgSD5pkrqVkQ9bsLWNLSo&_nc_ht=scontent-lax3-1.xx&oh=00_AYCH7bynNS1ae85ypeKtCgEzVp5UoeaIu5z9i2IvAI7u-w&oe=6645457C,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/430619389_10113095612060525_8633553753343301262_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7OeAEJSflgYQ7kNvgEH4Ms6&_nc_ht=scontent-lax3-2.xx&oh=00_AYBzPqqQen-4Lui51QGcNImmifz9hgkIVrl8zK7O_dWCWg&oe=66453F53,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432444372_10113095612429785_6347279273634198757_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=t01mhIbKZ3EQ7kNvgHKo7a_&_nc_ht=scontent-lax3-2.xx&oh=00_AYCiDbihDCGnr2ahKl7RKZEAUK83uNTZ-17wxD84wDGNvA&oe=66454EA6,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/430335154_10113095612290065_225366565897095805_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=EKvXQaB4O1QQ7kNvgGiiIum&_nc_ht=scontent-lax3-2.xx&oh=00_AYB7mWLEHkC940W0CCj25Mw38K3yCmBKv2f9PEQRIqBpOQ&oe=664549D0,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/431283458_10113095612644355_8146290175390645540_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Nhw_887sRMgQ7kNvgEzt-a_&_nc_ht=scontent-lax3-1.xx&oh=00_AYCNP7y_0h3WRL93ykiJnP5kquGTzvrGQOqkczD7ZX6lfQ&oe=66456593,-,,,,,,,,,,,,,,,,,,,,,,
"Wednesday, March 13, 2024",Driving,214,Bottomless Lakes SP,"Roswell, NM",3602,3,28,50A,No,No,Yes,33.3164453,-104.3308359,MDT (GMT-6),Bottomless Lakes Park Campground,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/433923204_10113106908936495_1465672491363307204_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=4mD1Rj8O-3kQ7kNvgH5xKQ6&_nc_ht=scontent-lax3-2.xx&oh=00_AYDBjfMyaf9Lg2oQ0l0hAYnXKzOX8AU5jHs0yhs_ZZgrvw&oe=664466CD,Lake at the campground,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432620898_10113106908667035_5849651882505358087_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wXuH0jip5IAQ7kNvgH-DX02&_nc_ht=scontent-lax3-1.xx&oh=00_AYDKZOCQpnlhI9BIpQlPmK57Ign14VEtL9fSbCkE4yztvg&oe=66445C18,Hiking near the campground,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432553520_10113106909270825_988193964271838335_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=aYr3ubSXjS4Q7kNvgGzWR-2&_nc_ht=scontent-lax3-2.xx&oh=00_AYCdHuDQmAeuUHQ4Pf3d5khd1Hzy2USpuBnEm0U16y1plg&oe=66447522,Hiking near the campground,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432548713_10113106908542285_7390126781690344779_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=k9PfH_v-yzcQ7kNvgH587JJ&_nc_ht=scontent-lax3-1.xx&oh=00_AYCLcalb4TMyE_mdaR0wHC8eSx5b0hqhIVW2sCguYJg1ag&oe=66446D6B,-,,,,,,,,,,,,,,,,,,,,,,,,
,Aliens!,,,"Roswell, NM",,,,,,,,33.3942655,-104.5230242,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432630253_10113106908367635_7381455776351780697_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7873g5XzYhkQ7kNvgGo_5tw&_nc_oc=AdjPiStgh7pqLtwAqJmwZ-EumFbNpBdBFajdSUSXw_lViVO_esXQA-yJvFsUYNEoQ6M&_nc_ht=scontent-lax3-2.xx&oh=00_AYDPUcXFe1M-29yzipZCA3dpyhOifLKXiw9sBOEebry3DQ&oe=664461D3,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, March 16, 2024",Driving,66,Brantley Lake SP,"Carlsbad, NM",3313,3,24,50A,No,No,Yes,32.5640317,-104.3806931,MDT (GMT-6),limestone campground,,https://i.imgur.com/2GhRxlc.jpeg,Campground sunset,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434264162_10113119285349065_2089484920355213170_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=g9ZIxoEWaqkQ7kNvgGzIGk1&_nc_ht=scontent-lax3-2.xx&oh=00_AYC8c1MgOCHqShR27rVe4MWzTosVmPOTmBkubY0IEB8HAg&oe=6644A78B,Pecos Diamond!,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Carlsbad Caverns National Park,,,,,,,,,,,32.137045,-104.5437529,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432744896_10113106909675015_1966011466825206747_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=38bm01Xhng8Q7kNvgHnM1Zj&_nc_ht=scontent-lax3-2.xx&oh=00_AYBerDIG4DxA_TuRW7QMhVlMexG8cj9JXjbT34ipIYlAXw&oe=66446874,Visitor's center,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432686624_10113106909380605_4212812373032739972_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AbkNIlGfn2cQ7kNvgFeErk4&_nc_ht=scontent-lax3-2.xx&oh=00_AYDGaOBcKAXkCnJppoBRhj5uXJelMis0KnGEiusocgGI-w&oe=664479BC,Entering the cavern,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432640554_10113106909515335_595326516170902617_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=SrDDqm6Gp28Q7kNvgH1sWUN&_nc_ht=scontent-lax3-1.xx&oh=00_AYBqHBTUuLkrYbyehumb3unv-Zf5bUao6XC4hQxsIEruEA&oe=66444D5D,Just inside,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, March 19, 2024",Driving,221,Rio Grande Winery,"Las Cruces, NM",3500,1,n/a,No,No,No,No,32.236348,-106.7590752,MDT (GMT-6),,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434243784_10113119292379975_7587791326263336066_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=WmVhMtgjwZ0Q7kNvgHRyY50&_nc_ht=scontent-lax3-2.xx&oh=00_AYBHCVr9VNIHyIYNcluklTZf1Zn2RRwKKX5xQQ5M0y2mNw&oe=66449761,View from the winery,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,White Sands National Park,,,,,,,,,,,32.7872403,-106.3256816,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434243779_10113119286496765_5275034254130690664_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=DjgXTNquyZ0Q7kNvgFTSkv9&_nc_oc=Adhq9uZcHFVzjwPDFd71xiELWD-lGonpoVOPJ_F437OKo6CHg3bra6fQWibhZ6vn3Go&_nc_ht=scontent-lax3-2.xx&oh=00_AYDl6S_HAFEJsWuNKTmaFJtuH7FYb625pWTzvd5gvvzljA&oe=6644A29A,Dune sledding,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434262052_10113119286586585_7442004220182488992_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IgodlWXzXxcQ7kNvgGe6Rt-&_nc_ht=scontent-lax3-2.xx&oh=00_AYBfEPnMwzsjMp-hGeH4TZjLPnHhSLg4f8nuBKInuzRQ0A&oe=66448AA6,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434239653_10113119294475775_9170398443704372059_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=lYGWSpO6wDUQ7kNvgHc91kh&_nc_ht=scontent-lax3-1.xx&oh=00_AYBAED228riSWscKa6MTLw0VtZGbIsG4qEtmZFVJ7rsaww&oe=664482EE,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434284794_10113119286641475_4512571427403557721_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AT2D9qPR0BUQ7kNvgG2Y-p8&_nc_ht=scontent-lax3-1.xx&oh=00_AYBiy1V7Ot-Qd8mG_0WfNM-k3zFXTHy1IGHutqQJ2YPabA&oe=66454D84,-,,,,,,,,,,,,,,,,,,,,,,,,
"Wednesday, March 20, 2024",Driving,10,Las Cruces KOA Journey,"Las Cruces, NM",3500,1,52,50A,Yes,Yes,Yes,32.2924695,-106.8596845,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Thursday, March 21, 2024",Driving,197,Cattlerest Saloon,"Willcox, AZ",4179,1,2,50A,DS,No,No,32.2365566,-109.8505589,MST (GMT-7),,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434258650_10113119289860025_8089194964639275924_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=EYA5O1jDfKkQ7kNvgHfgDRV&_nc_ht=scontent-lax3-2.xx&oh=00_AYAg55NVC343LoozuctaEBky9XHc6goaw6xIknCwnz8i5w&oe=6644B275,Sunset,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434032064_10113119292844045_7456307887725466986_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fgbjt2s2hKIQ7kNvgHY0c1F&_nc_ht=scontent-lax3-1.xx&oh=00_AYATc3lrDYa8TSilYEw8XBUUB_CaTv-3xrsKt2ZCEfrSXQ&oe=66456CAB,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, March 22, 2024",Driving,3,Grand Vista RV Park,"Willcox, AZ",5397,2,TBD,50A,Yes,Yes,Yes,32.2620407,-109.8338428,MST (GMT-7),,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432979870_10113136917359375_7152669755166397410_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=3XVFWQR2JxMQ7kNvgFWJ3Jj&_nc_ht=scontent-lax3-1.xx&oh=00_AYBRqhWpMtM5SPn6EYhk7UDQsfECO9DFFrGukybojcOoDQ&oe=66447D60,Sunset near the campground,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Chiricahua National Monument,,,,,,,,,,,32.0121363,-109.3416105,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434246734_10113119287679395_1867807518545686939_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=zzM-Lg7fw7kQ7kNvgGIT46E&_nc_ht=scontent-lax3-1.xx&oh=00_AYCJd8lzMGG7q7QpZVe6LgiU9YUOOeYXUw7XNbADxQ8vBg&oe=66447E52,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434280201_10113119295428865_20855677995864569_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=OYGUl1KnMNwQ7kNvgG6JayK&_nc_ht=scontent-lax3-1.xx&oh=00_AYDdblOyJxm1FPGFvrOfqdh48PchYDgORfR3i8FEXPNQUQ&oe=66456518,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434264014_10113119294096535_7098968721110018764_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=25QJ3lccz5YQ7kNvgGqAbqK&_nc_ht=scontent-lax3-2.xx&oh=00_AYCfXwwFNyI0wPSbGEKjqRQqL-vzDHRG5EL7alEHbaUZbA&oe=664497A4,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434227464_10113119293567595_7468978254924796601_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=24pB4GRhU54Q7kNvgE_uTUx&_nc_ht=scontent-lax3-1.xx&oh=00_AYDRDvj3P0us6BYHnGT0kASYGvA8LyHcX2TRYalFo3wdNw&oe=664563A3,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434242959_10113119288427895_3322589779283185802_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=cu0IE7D4KdcQ7kNvgEM2y-5&_nc_ht=scontent-lax3-2.xx&oh=00_AYC9epWio7jmwXD5tZdCbvFa1wXdREN9RDij_C4wa6Bh5Q&oe=664485D2,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434233983_10113119295573575_8863284821667647969_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=tVMxfRLfKEUQ7kNvgF_3XKV&_nc_ht=scontent-lax3-2.xx&oh=00_AYBxfSnomdzpn_ucxLDWdTFqBIklTeJ8nACPgSb3upac6g&oe=664489A2,-,,,,,,,,,,,,,,,,,,,,
"Sunday, March 24, 2024",Driving,85,Kartchner Caverns SP,"Benson, AZ",4559,3,KTC-55,50A,No,Yes,Yes,31.836596,-110.3488848,MST (GMT-7),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,OK Corral,,,"Tombstone, AZ",,,,,,,,31.7130202,-110.06762,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432947785_10113136917114865_6569288935551824045_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KJVbdMidBxIQ7kNvgGA0ARj&_nc_ht=scontent-lax3-2.xx&oh=00_AYDvhmsGG_DUskiXFfJUdtUFvx7uYgwxp_zuZCaSbF23Pw&oe=66449E2C,Ready for Tombstone,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432961748_10113136917209675_1849520784381516610_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ddx1eeb0SmUQ7kNvgHJniBX&_nc_ht=scontent-lax3-2.xx&oh=00_AYC2DC1eIukYcGUWdkQkPtDP221fpbd-yxH9sOpywT4zlQ&oe=6644993F,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,"Bisbee, AZ",,,,,,,,,,,31.4481547,-109.9284084,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Wednesday, March 27, 2024",Driving,54,Catalina SP,"Tucson, AZ",2654,9,CLT-B-25,50A,No,Yes,Yes,32.4265434,-110.9253819,MST (GMT-7),catalina state park campground b,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432922056_10113136917429235_3896867015582885189_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=x-MXDJAP82YQ7kNvgGfBS6v&_nc_ht=scontent-lax3-1.xx&oh=00_AYBhwsSJi5wVCEafmB6qwPSSl0Xur_OgxuoZwihnYhwdsg&oe=664493FA,Campsite view,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432945632_10113136917628835_9104392142346367247_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gqNP_zDL5K4Q7kNvgE1va7_&_nc_ht=scontent-lax3-1.xx&oh=00_AYApWrWsOz-I9wg-DCyyU9GAQSCjAboRMTGZHC3MA5ONkA&oe=66455F4A,Hiking in the park,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/432912773_10113136917693705_9042078873330615853_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=FcOO7fdT3XYQ7kNvgFRoEOu&_nc_ht=scontent-lax3-2.xx&oh=00_AYBc4Z3jFlxMmYzIcp9exX5Pe4ctHlR26pW-DqshflU5fw&oe=66456C64,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/434868626_10113136917284525_5555953119007069938_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Ie3F6pEUn2sQ7kNvgFxhmxS&_nc_ht=scontent-lax3-1.xx&oh=00_AYDRRa0ylvv_7b5cw-eiVJiBOqQTn7PRJWeMXvsvYdtX7Q&oe=664562A5,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/434840781_10113136917025045_1770205387661890492_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_UJyKKOpqukQ7kNvgEzBaw0&_nc_ht=scontent-lax3-2.xx&oh=00_AYCDscFT7CPHTze5tUk43ey9vdJRESwzNpad7JJYcyRWOg&oe=6645449B,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/433002422_10113136917544005_180532347453416492_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KhAJPOOzbMEQ7kNvgE0ql-j&_nc_ht=scontent-lax3-1.xx&oh=00_AYA0yYqTbxgAFuNbaXAk-x2H_-FTtib1hXhMdHwLlyFZ1Q&oe=66454492,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436907255_10113157486788075_879592646182459461_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wNyDnF4DlW8Q7kNvgHzov1G&_nc_ht=scontent-lax3-2.xx&oh=00_AYDklPnKvobCWpCb6XGusUxqNtFAf3-JlaADt5iTQCdfDA&oe=66457797,-,,,,,,,,,,,,,,,,,,
,U of A Baseball,,Hi Corbett Field,"Tucson, AZ",,,,,,,,32.2129525,-110.9197125,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Titan Missle Museum,,,"Green Valley, AZ",,,,,,,,31.9027417,-110.9992833,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/433262933_10113136917808475_5598274910168638103_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=dH8QFn9NdIgQ7kNvgHfdepD&_nc_ht=scontent-lax3-1.xx&oh=00_AYBoJQ2ajSgjGBZEWdnvhIxvOADD-pjlRdpqzDZUH3hxKQ&oe=6644ABF1,Mission control,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/432918228_10113136917948195_6607978518094247366_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=a2jrEwXSHYYQ7kNvgHZtK6M&_nc_ht=scontent-lax3-1.xx&oh=00_AYAeHiHsvVQfLiHq0SJq4Kt2w7-SybP-94pKu9_Txz8ECQ&oe=66449B09,The missle!,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Ballroom Dance,,Invictus Dancesport,"Tucson, AZ",,,,,,,,32.3067331,-111.0097629,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,West Coast Swing,,Dream Dance,"Tucson, AZ",,,,,,,,32.2873778,-110.9657056,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Saguaro National Park,,,,,,,,,,,32.1830899,-110.6126823,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436803791_10113157486723205_1992704893337401060_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ddBC_hcHTnoQ7kNvgFDPXNx&_nc_ht=scontent-lax3-1.xx&oh=00_AYCErugb5MJd2DpABqurtYgbFnOD0G-teLFfRKNAdsCCpw&oe=66456900,Massive cactus!,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436753862_10113157486668315_3512350428246125685_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qs01jOF6j18Q7kNvgGVC_VZ&_nc_ht=scontent-lax3-2.xx&oh=00_AYDYKTO4t87tWM_OemO1t9yvCU4oyD_aBhQVQBLlJARHDw&oe=6645483A,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436866479_10113157486309035_6296206719764146682_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_8pUwkk4DwMQ7kNvgGBEMfA&_nc_ht=scontent-lax3-1.xx&oh=00_AYC6yioTY-SqjNxSXPeueLIPtTjOK5iIc1RlWX8Y-QoOzQ&oe=6645583F,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436729532_10113157486448755_2893108261841790675_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2JGXowF1ml4Q7kNvgHKOufn&_nc_ht=scontent-lax3-1.xx&oh=00_AYAuCstqs914vCGTIl06ujEYIjsqDWCKiYZEUHmaxj-vug&oe=66456953,-,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, April 05, 2024",Driving,245,Pilot Knob RV Resort,"Winterhaven, CA",272,2,TBD,50A,Yes,Yes,Yes,32.747145,-114.7636939,PDT (GMT-7),Encore,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, April 07, 2024",Driving,141,1000 Trails Palm Springs,"Palm Desert, CA",119,7,TBD,50A,Yes,Yes,Yes,33.7634686,-116.3109684,PDT (GMT-7),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Palm Springs Village Fest,,,"Palm Springs, CA",,,,,,,,33.82492513,-116.5468082,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Joshua Tree National Park,,,,,,,,,,,33.873415,-115.9009923,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437053756_10113171229188195_109569955212253162_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=lV2a_yUEJzQQ7kNvgGH_d5M&_nc_ht=scontent-lax3-2.xx&oh=00_AYBI0o27fk7rOdfQlGJvUUxZ-Q-FrA5NgTJNIZ6tVMSykw&oe=66456C2F,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436994972_10113171229562445_4390018981884816068_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=n1lAwgKH6nkQ7kNvgGhzDuc&_nc_oc=Adh7IMUH96AhDXDUrhhlo4_ZIFFVHovNSGtWLzZZqJrqWTQAm6GNj1G-gOzlQrs24r0&_nc_ht=scontent-lax3-2.xx&oh=00_AYCj00Azaff5Ugegfrvo1d_vxf6dyKz_LGypp6o9IpOZ9w&oe=66455F22,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436990699_10113171230116335_789579654829516314_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=M_pZ0AngSn4Q7kNvgFaxLkZ&_nc_ht=scontent-lax3-2.xx&oh=00_AYCahCXIx8pUg_6oiP-UiiNWt1s_EYQdSEX3PT2SAwoFVA&oe=664564D3,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436898966_10113171230375815_3210990304553814074_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yIM_3QqQdYgQ7kNvgF2aElU&_nc_ht=scontent-lax3-1.xx&oh=00_AYAUs4M9LZn3oTiO9quf0CVv2-hKPD890YyWpHxf0YO2vw&oe=66457999,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437048955_10113171229841885_5491574484621641492_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IbsiILYUIWcQ7kNvgHwJfYP&_nc_ht=scontent-lax3-1.xx&oh=00_AYDAAEKPyetd5vSbs_en2KpmD454ZQyPoqQcoH2OuRyCRQ&oe=664553FB,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436896472_10113171229283005_1001432417272680436_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wtceJFyVt88Q7kNvgGPX9JN&_nc_ht=scontent-lax3-2.xx&oh=00_AYALBLVImhkjOURqPtD_o2_JdU-5impB2Q847kT8mOSmxA&oe=6645834F,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437073936_10113171228963645_1769487653679347877_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=iBsinb8j68EQ7kNvgFPFwul&_nc_ht=scontent-lax3-2.xx&oh=00_AYBsnhLCptHBkrVODAdf6JE9od52L13vRC_oP8j-c7RjFg&oe=664551C7,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436817711_10113171230615335_8426228224795723074_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=omiogjP9flAQ7kNvgE5jlID&_nc_ht=scontent-lax3-1.xx&oh=00_AYDijRBI8OpZMnFVeRAbHT2ueQQ4T3fyXg2QOXwlPkUwXA&oe=664570E6,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437049242_10113171229098375_5643939426867149904_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ufBAO49WSYQQ7kNvgGOtIeC&_nc_ht=scontent-lax3-1.xx&oh=00_AYCFIocJDjANV_SABaECsmQqE9A2v77M8DDjvW6Qq36_ZQ&oe=66454ED3,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437060569_10113171230844875_1264555431643867283_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=o2dNih033XoQ7kNvgFkq7mR&_nc_ht=scontent-lax3-1.xx&oh=00_AYA6M6yhJnT0V_rzU-eumjO_MTiBCVZl3FjUxTT-rK-TUA&oe=66455214,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437068476_10113171230745075_3047413211938427277_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=oxH09xMVJPAQ7kNvgFRNLhg&_nc_ht=scontent-lax3-2.xx&oh=00_AYBoABZRxoZbKtzon1PoDYq9zhel-dGQMImXH-GWJ4LWQg&oe=66456182,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437060936_10113171228833905_513740057269612900_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhxuFpIQ7lwQ7kNvgGiaN0y&_nc_ht=scontent-lax3-1.xx&oh=00_AYCuFxA1zfgHLK3pI5VarV1fjqDCi3RM8LMpXjeMLZCUfg&oe=664582C7,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437054634_10113171229956655_8430029344826000749_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bG0O-ebQGnsQ7kNvgFIA0S4&_nc_ht=scontent-lax3-2.xx&oh=00_AYCnDqVQ6ednrn2_d38SuX9bE-I1zlufB1KOu_9tDJ4fAg&oe=66455DD5,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436961379_10113171230465635_9206308351879494452_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KplF-HM837AQ7kNvgHWGS7M&_nc_ht=scontent-lax3-1.xx&oh=00_AYBmoBdQJjzzqwQRCSh5tDMLwCBV67-SKo0g5mcDBHCVgA&oe=66458111,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437053782_10113171230046475_8117770197858656738_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KJj2eFdy9vwQ7kNvgEMx9Ec&_nc_ht=scontent-lax3-1.xx&oh=00_AYCfNUE4jXfO2X_2zse-HP7IFOCA8qB-6Ryyv-xk9y3bzQ&oe=664554F2,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437053305_10113171230206155_7850206838133368287_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mw5r4XnF-voQ7kNvgGQIHV-&_nc_ht=scontent-lax3-1.xx&oh=00_AYCNhKzQv90-xmNKiGMnYEexlH8Mqj4xdK2jFT_bR70xRQ&oe=664560D1,-
,SoCal Lindberg Meetup,,Sylvan Park,"Redlands, CA",,,,,,,,34.0599329,-117.1680177,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, April 14, 2024",Driving,180,North Ranch RV Park,"Congress, AZ",2801,2,TBD,30A,Yes,Yes,Yes,34.104932,-112.8309524,MST (GMT-7),,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/438759469_10113185453582395_6793046756485210271_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Ye_d37TRDCYQ7kNvgFZVh9W&_nc_ht=scontent-lax3-1.xx&oh=00_AYDKgKyLSh2brkNpAxUpM1oK_4riX2gP6tCPBftv1nL37Q&oe=66455BDC,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, April 16, 2024",Driving,93,Dead Horse Ranch SP,"Cottonwood, AZ",3320,3,DHR-87,50A,No,Yes,Yes,34.7537237,-112.0215606,MST (GMT-7),,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437099352_10113185453732095_8039459024174232902_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Vj65sOix9I0Q7kNvgEq06rY&_nc_ht=scontent-lax3-1.xx&oh=00_AYDia5Z7NLFHQhCUluGd34Vz32-3b5rlN_kYpycE9hVrAA&oe=664568CD,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440030145_10113185454775005_5783353081198960229_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=lfczqRWZVUoQ7kNvgH_v78e&_nc_ht=scontent-lax3-1.xx&oh=00_AYCbRHx80XIpDD5ovnOk5BUCAOs_QOvxiQ-8ojgLsfRFYA&oe=66455763,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,"Jerome, AZ",,,,,,,,34.7489107,-112.1137716,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437979764_10113185453662235_6178546049559503439_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=PcY33mPvQXsQ7kNvgEd5I2j&_nc_ht=scontent-lax3-2.xx&oh=00_AYAvg1cOw67wH04eAkdJS_wqvZMwLqXpgTI9Su5GD_ijHg&oe=66457E87,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Sedona Jeep Tour,,Safari Jeep Tours,"Sedona, AZ",,,,,,,,34.8712197,-111.7614806,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437141997_10113185454086385_59626680971414248_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=LYC_cIYDJJ8Q7kNvgEoLEOf&_nc_ht=scontent-lax3-1.xx&oh=00_AYCIG08SC-t4FqdW15un1GS165XxuNY_mCHAmS2CAsbC6Q&oe=66458469,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/438729737_10113185454425705_4174608953225610359_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=OrHH-tvPQaQQ7kNvgGiQ3tw&_nc_ht=scontent-lax3-1.xx&oh=00_AYDLZwEgHEaJVXn7OVWxxn9TRbafuoM4cDSoHc13AdHoeA&oe=66454E92,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/438685128_10113185454675205_3701259036264769928_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=sRoHBQb14NoQ7kNvgE9oFQa&_nc_ht=scontent-lax3-1.xx&oh=00_AYCzwWEiHdS5LnFmBpTz1IWJJeHxvKWwoiv1baQLW6WQ8w&oe=66455563,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437962495_10113185454186185_9050365454714712070_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=DUzDUYz8PlEQ7kNvgFeGJqC&_nc_oc=Adja1zhbPwTcb3wWJMY5e7an-l2k9eON7dktqAdA9v-dl3FOg9LPZPNaIfjB5b4Mdwc&_nc_ht=scontent-lax3-2.xx&oh=00_AYDC4ZRiDaxmFJdRcsKjcKLY7ZUNlWqwRju1W67DgaNqWQ&oe=66456B6F,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440069007_10113185454615325_5062732255644425264_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=EfikrRx_iPcQ7kNvgEEzr8U&_nc_ht=scontent-lax3-2.xx&oh=00_AYDL3peAuMxalA8XMeHIpTkDhPypg1vx5PFMhBNjV1wqIA&oe=66455B8C,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/438676488_10113185454320915_6604732130408124454_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=TLhC4hm-7sUQ7kNvgHmYpvn&_nc_ht=scontent-lax3-1.xx&oh=00_AYAMH4jTEodGQ3itn-lpuioONpHRIX_BhhbrkST7ngz2QA&oe=6645865E,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437947366_10113185454540475_3486480028256118072_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=jVBi84crZbYQ7kNvgGFmhbz&_nc_ht=scontent-lax3-1.xx&oh=00_AYCw4dbPYrAlO284p52qA-VAX0ZA3GsvuCpaAQFuxNVW4w&oe=66457D80,-,,,,,,,,,,,,,,,,,,
,Tuzigoot National Monument,,,,,,,,,,,34.768481,-112.0268701,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/438668968_10113185453896765_3138779496315142613_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=MJa64aomGHQQ7kNvgHmNmIq&_nc_ht=scontent-lax3-2.xx&oh=00_AYAr4UU-tvvRMguiyTUhr_j84oMKepzy0vcQGopI4DD7oQ&oe=6645546A,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/439874260_10113185453821915_6118665551552068428_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Wp8jDKDVTvIQ7kNvgG5Ea4a&_nc_ht=scontent-lax3-1.xx&oh=00_AYCW4jWjt5NpXDjNBYP54zPrwnTElvuPP_hq1MqeVJStbg&oe=664582F5,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, April 19, 2024",Driving,129,Homolovi State Park,"Winslow, AZ",4888,3,HLR-20,50A,No,No,Yes,35.03009999,-110.6510889,MST (GMT-7),,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/439873039_10113185455064425_8829700042115867698_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=y-GzI8F1hSwQ7kNvgGT6KjF&_nc_ht=scontent-lax3-1.xx&oh=00_AYBW589TnrrIvh_dh0FeqW2-X8S_rVCzFO4i1UsZOFzE1w&oe=66455BAD,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,La Posada Hotel,,,"Winslow, AZ",,,,,,,,35.0214483,-110.6950852,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Standing on the Corner,,,"Winslow, AZ",,,,,,,,35.0234878,-110.6981315,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/438702314_10113185455283985_4972615550735341330_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=n8Lxgd5ijPEQ7kNvgG9gt4f&_nc_ht=scontent-lax3-1.xx&oh=00_AYAd4GjrsLTnO6PZXT584e6P2Mf2JTOIEy2CQwhcmHiw1A&oe=6645806B,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/439748472_10113185455358835_5329930456260078531_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=DwSz6fqVwQ0Q7kNvgFShqyU&_nc_ht=scontent-lax3-2.xx&oh=00_AYAheNlKb9G8mChkYW06aB_HZSAUzYIjy7fKyr5lKh2f1w&oe=66457EC5,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437104546_10113185455214125_7805018466096426926_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ZX26ffviPGwQ7kNvgHakVCd&_nc_ht=scontent-lax3-2.xx&oh=00_AYDWOKDVjurUB-5hoQKoOYh4CHMuDuKNaFPrV26CVoNprw&oe=66457F0B,-,,,,,,,,,,,,,,,,,,,,,,,,,,
,Waltz Class/Social,,Jazzercise Flagstaff,"Flagstaff, AZ",,,,,,,,35.1970507,-111.6246951,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Homolovi II Archaeological Site,,,,,,,,,,,35.0848197,-110.6427383,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Walnut Canyon National Monument,,,,,,,,,,,35.1690189,-111.5043369,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/438328288_10113185454924705_6294748466502912832_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JJEOewC3SJIQ7kNvgEBgqY6&_nc_ht=scontent-lax3-2.xx&oh=00_AYBzoEL7wprqBX65sjcrfTJbii8wVjcW2LnIxjSA3DxwfQ&oe=6645715D,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437938820_10113185454849855_7323218331414670838_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=d-WPKNA76d0Q7kNvgGTaVni&_nc_ht=scontent-lax3-1.xx&oh=00_AYBQT4-25qk1Nc2GaIr6uHD2d4zkzdefxzlkc4bg9Prupw&oe=6645733B,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/438681663_10113185454989575_3698930338277274294_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=kizHf1EwG68Q7kNvgFDzYXY&_nc_ht=scontent-lax3-2.xx&oh=00_AYABfqU0iqYXJm2gYWxJIF_jczlARjym608X0rjWmPYvOA&oe=66456501,-,,,,,,,,,,,,,,,,,,,,,,,,,,
,Arthur's house,,,"Flagstaff, AZ",,,,,,,,35.20500687,-111.6459523,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Monday, April 22, 2024",Driving,148,Grand Canyon Trailer Village,"Grand Canyon, AZ",7021,3,TBD,50A,Yes,Yes,Yes,36.0528892,-112.1150912,MST (GMT-7),,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440852648_10113198218491415_845840820733382715_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=8ZE4oOMiw5kQ7kNvgFz892f&_nc_ht=scontent-lax3-2.xx&oh=00_AYCyViy1s9wBNTtmGoit5iUZjoHC_XAJfGkyfTl4VFiDnw&oe=664584FD,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Grand Canyon National Park,,,,,,,,,,,36.0591151,-112.1091934,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440859857_10113198205397655_324579716388216383_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=kJNkSQ0r4YYQ7kNvgHIz8lD&_nc_ht=scontent-lax3-2.xx&oh=00_AYCzbLM9zb16dr0SQSk3wgaSWEPmA9nhWjimauTR8T2vfw&oe=664562CE,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/439620472_10113198219070255_8096319988721014429_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ZF2S7A-dwAQQ7kNvgFlcz90&_nc_ht=scontent-lax3-1.xx&oh=00_AYCzIE4lXK5zRInOfH3sJMHvzr3l4OVikuO7MNacr5swWA&oe=66455B93,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440871847_10113198218865665_4257191810853866767_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=OISak4oR5YoQ7kNvgHUog64&_nc_oc=AdjszQSNcsxrNBvVfgggWfoDsFCf-psx_a-T1u5aCwNadwz-EaO0qi0Tdrmv5Ybc6Mc&_nc_ht=scontent-lax3-1.xx&oh=00_AYDP6z6BDy-Srvnz4o4Gkz73Jw1RXs-4b4YEbJv3I6xKsA&oe=66456273,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440744693_10113198218730935_7103901472874307150_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Em4lb26LMo0Q7kNvgEQTdHd&_nc_ht=scontent-lax3-2.xx&oh=00_AYAqPaJcRAiF_vtKQShKSKblZjDe7rWbE1eoPuWmHS8yHQ&oe=66457108,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440871097_10113198218506385_1744242270945896563_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wrqItfYiW9AQ7kNvgHsm7Nr&_nc_ht=scontent-lax3-1.xx&oh=00_AYAh2MizT0XgjzIH0vjn7StPb-QfMMmN-FAJIO7B_Ambaw&oe=664585CD,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440876332_10113198218760875_812820213798582057_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qVjEFFxHYJAQ7kNvgEEP-92&_nc_ht=scontent-lax3-1.xx&oh=00_AYAMFe5FAeiggk58yHosHLJgdjUgO3zKqQWdZLD6wj7wSA&oe=66458721,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440878233_10113198218586225_2752551743352132450_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=NqExqlEEAxYQ7kNvgFOKze1&_nc_ht=scontent-lax3-2.xx&oh=00_AYA1bz57SNF2r2DzA9dby5Hnc7comzgcKHKXxTUHOq5JMA&oe=66458582,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/439562853_10113198205677095_396198336307083866_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ypp2wj1Qa8AQ7kNvgECmtOH&_nc_ht=scontent-lax3-1.xx&oh=00_AYCO3ky2CvXGHFRn3QSbnFIGDGwKtz8ru6twr_j5_BWyYg&oe=66455E8E,-,,,,,,,,,,,,,,,,
"Thursday, April 25, 2024",Driving,57,NavajoLand Hotel,"Tuba City, AZ",4941,2,TBD,50A,Yes,No,No,36.1306034,-111.2420668,MDT (GMT-6),NavajoLand Tuba City R.V. Park,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Monument Valley Tour,,,,,,,,,,,36.9813728,-110.1123657,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/439405995_10113198206166115_4145117360236529897_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=vdq0X3FrakEQ7kNvgG9QZ_7&_nc_ht=scontent-lax3-1.xx&oh=00_AYAC4jplLZqjAlqN5jKVKTbOldXZ7pt5_LTgbOWPpvkuRg&oe=66456D3F,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440850778_10113198217767865_7050899756566542304_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mABckDZOJnUQ7kNvgHlpy8f&_nc_ht=scontent-lax3-1.xx&oh=00_AYCDVipZs65Q6w4iz9TGEia3r4zid1_ORobw6CFbnDx6qg&oe=66457633,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/439311610_10113198218940515_9091237081121359176_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=K_0TE-XLQq0Q7kNvgH5GcQi&_nc_ht=scontent-lax3-2.xx&oh=00_AYCdXV58T8RKCoHpw-vGiND0UzsLRyP1xcwwGyTK51-9Jw&oe=66457DC9,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440780969_10113198206240965_7884878423659057257_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=6EuMvwuAr3cQ7kNvgGFDfAG&_nc_ht=scontent-lax3-2.xx&oh=00_AYD-cCylmn6YWi-r2xL43y7o8HD77kb7D6KJH8iYSOgBzw&oe=66457B9D,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440777120_10113198205841765_508350707738296059_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=BjU9IhmOR1oQ7kNvgF9A-mA&_nc_ht=scontent-lax3-2.xx&oh=00_AYAkAwKYRn0l_x3MLyH-FbYb_8KarGIB_rAqsKL0To9iKw&oe=6645581D,-,,,,,,,,,,,,,,,,,,,,,,
,Navajo Code Talkers Museum,,,"Tuba City, AZ",,,,,,,,36.1302507,-111.2405677,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, April 27, 2024",Driving,82,Wahweap RV Park Lower CG,"Page, AZ",3732,3,TBD,50A,Yes,Yes,Yes,36.997326,-111.4990853,MST (GMT-7),,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440967893_10113214047150655_8121483241679110054_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=8gy3OYH2TvMQ7kNvgHl71IZ&_nc_ht=scontent-lax3-2.xx&oh=00_AYBI28mxxzAesIFAytTvaE5cnB-9zBYN7vzPbqHhOd1vwQ&oe=664575E5,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Glen Canyon National Recreation Area,,,,,,,,,,,36.94305136,-111.4934369,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Upper Antelope Canyon,,,,,,,,,,,36.8619103,-111.3743302,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440805613_10113214046956045_6177673929420229343_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=P9aiDL1eFvUQ7kNvgFXY4D-&_nc_ht=scontent-lax3-1.xx&oh=00_AYAZq6_2AdSSxntjSGIUPtHTY-cAQ29XqG6BIWud4xlPeg&oe=66456861,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440451034_10113214046851255_1393208915626010849_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=T6Krc93LsHwQ7kNvgHU083v&_nc_ht=scontent-lax3-2.xx&oh=00_AYAwTNmPtFYAtV1DAOTf9XWWR2nG1dPs5sm1yp41iZ7IWA&oe=66456D66,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Lower Antelope Canyon,,,,,,,,,,,36.9031279,-111.4132505,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440582359_10113214047589775_3919554006209044981_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=4DwkYqZyWYUQ7kNvgFD38y-&_nc_ht=scontent-lax3-2.xx&oh=00_AYAUIbphY1bZzhCAK_u9VHxK8eMv65RraFNsdbGrdgjBSQ&oe=66455C45,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440577408_10113214047280395_515409559848036353_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=nStFa5n69bMQ7kNvgEcp8Zn&_nc_ht=scontent-lax3-1.xx&oh=00_AYC0jTdV850EpRUH1IYSUh00vw78EHxgSBAyzBT_RQ_IpQ&oe=66456DC2,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440582836_10113214047479995_8225642328666681974_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=r3EsgPVmtNEQ7kNvgFJR9Bn&_nc_ht=scontent-lax3-1.xx&oh=00_AYAMfUvnvfhRjg32iY-8VA86MfId2cPwzl6YpwBfe5WxZQ&oe=664587DD,-,,,,,,,,,,,,,,,,,,,,,,,,,,
,Horseshoe Bend,,,,,,,,,,,36.8790612,-111.5103627,,,,,,,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440566158_10113214047030895_8748226223908274274_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=1inIW7RqBcIQ7kNvgGh4zD2&_nc_ht=scontent-lax3-1.xx&oh=00_AYAUX17H4QB9xs-M2nc6tkRTHdS_MRkDVislVO0fkN1bJQ&oe=66455E1A,-,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, April 30, 2024",Driving,151,Zion Canyon CG,"Springdale, UT",3921,7,E36,50A,Yes,Yes,Yes,37.1929646,-112.9912374,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Zion National Park,,,,,,,,,,,37.2982022,-113.0263005,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/441546630_10113214048293365_1168183178685080078_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xTA76d02hvMQ7kNvgFbcTWy&_nc_ht=scontent-lax3-2.xx&oh=00_AYD1-c2edR-434emhhjbxo43xebfBT-uyL1bK0DMjN_4Jg&oe=6645683A,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440572572_10113214048368215_5090148735519281793_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=WsxDGI4t9IMQ7kNvgGqeyB8&_nc_ht=scontent-lax3-2.xx&oh=00_AYAqPjuMbkcn_7CiX1_dzrwkcCUuYnaaJHsXzY4QWWw4ag&oe=6645540D,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440593538_10113214048727495_8475342806676109381_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=UBg8OMHEHg8Q7kNvgFy-8DS&_nc_ht=scontent-lax3-1.xx&oh=00_AYCdEwIHkramhLcjRCCcsjvbX9b7n0GEP8hN923bvalokw&oe=66456CE6,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440577578_10113214048832285_6525195968938032405_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=rxbYxNt8mhgQ7kNvgHL60RG&_nc_ht=scontent-lax3-2.xx&oh=00_AYD3JxpBgBFJRokteJpS7wwRChKXW6YjK0Tsg3NOP3ge8w&oe=664573BB,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/440964136_10113214047964025_7561200796159225792_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=LoJIJKM-0TYQ7kNvgGlb06-&_nc_ht=scontent-lax3-2.xx&oh=00_AYDaMeJTe8pP0HecmJxaKiBJvX-BPBU9Wz9WTjmW0PCKfw&oe=66456232,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440979218_10113214049056835_3703592239227582380_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=vmpmWusLj0QQ7kNvgEPZbcP&_nc_oc=AdgWYRNQkfNugqPgkHadW0WCeZlhizX40NgaYrl49NWwRGMQOgqqMI0TSNlFmeguZZg&_nc_ht=scontent-lax3-1.xx&oh=00_AYBd3muCy1n1rAPAZQKxhCU_uneeklQ5Ric2Bwcolmmeyw&oe=664557AE,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440587445_10113214048203545_7946263333828326696_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=-6zVIyZJdckQ7kNvgFnERLB&_nc_ht=scontent-lax3-1.xx&oh=00_AYBKO4aS5VvxiMSoOXtHBu09JDNsQ10YZaldywlGknY1YA&oe=66457E93,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/441460383_10113214049206535_2706169722376781305_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=YytkiMMYuI0Q7kNvgFcRxS8&_nc_ht=scontent-lax3-1.xx&oh=00_AYAU6lTyDqkCYjD4TUJUQuA20nJe5GBODEVxBsJ-AAmnmA&oe=664568CF,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440577943_10113214048612725_4355507670435335357_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mFs4toRgHHwQ7kNvgELPM7Z&_nc_ht=scontent-lax3-1.xx&oh=00_AYAL6UipsZ4NiAh_f7UFHnXJSNljGCuv6ldWxdawcJfHTA&oe=66457F6B,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/441491822_10113214048473005_7155109734472511915_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XPI_33J4yEcQ7kNvgFfOfWc&_nc_ht=scontent-lax3-2.xx&oh=00_AYCgM6cvmX3GQ2loVhfIr2JHEvqPQCRpPgnnLjD8jMhzVg&oe=664580C6,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/441030288_10113214047699555_2594951324405862547_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=p8PkMmmIsD8Q7kNvgF5oH3u&_nc_ht=scontent-lax3-2.xx&oh=00_AYBjn4MKsf0CjiRTGp9ls7Oc2x4uprHuC1WxGHZcKdvu5Q&oe=66456CEB,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/440803093_10113214047864225_4264003925712066284_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Ax1tnZ0HSUIQ7kNvgFvtlRD&_nc_ht=scontent-lax3-1.xx&oh=00_AYA3sVmGtP-DMSaKUn2w7i0FAoww5S5dvi0pWoWKJcfX9g&oe=66458897,-,,,,,,,,
,,,,"St. George, UT",,,,,,,,37.0965278,-113.5684164,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,"Cedar City, UT",,,,,,,,37.6774769,-113.0618931,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, May 07, 2024",Driving,118,Dixie Forest RV Resort,"Panguitch, UT",6633,7,38D,50A,Yes,Yes,Yes,37.8146135,-112.4346644,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Bryce Canyon National Park,,,,,,,,,,,37.5930377,-112.1870895,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Capitol Reef National Park,,,,,,,,,,,38.0877312,-111.1354983,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, May 14, 2024",Driving,256,Moab KOA,"Moab, UT",4607,7,TBD,50A,Yes,Yes,Yes,38.523874,-109.4963551,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Arches National Park,,,,,,,,,,,38.733081,-109.5925139,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Canyonlands National Park,,,,,,,,,,,38.2135733,-109.9025345,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Goblin Valley State Park,,,,,,,,,,,38.573697,-110.707109,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Fiery Furnace Hike,,,,,,,,,,,38.7435404,-109.5615864,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, May 21, 2024",Driving,223,Vernal KOA,"Vernal, UT",5318,3,TBD,50A,Yes,Yes,Yes,40.4694307,-109.5285888,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Dinosaur National Monument,,,,,,,,,,,40.5130533,-108.9487453,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, May 24, 2024",Driving,311,Gros Ventre CG,Grand Teton NP,6568,7,99,No,No,No,No,43.6159427,-110.6658657,MDT (GMT-6),gros ventre campground,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Grand Teton National Park,,,,,,,,,,,43.7904282,-110.6817627,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, May 31, 2024",Driving,98,Fishing Bridge RV,Yellowstone NP,7770,14,TBD,50A,Yes,Yes,Yes,44.5657137,-110.3660453,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Yellowstone National Park,,,,,,,,,,,44.427963,-110.588455,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, June 14, 2024",Driving,162,Bridger Brewing,"Three Forks, MT",4075,1,n/a,No,No,No,No,45.9202897,-111.5901746,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, June 15, 2024",Driving,239,Lewis & Clark RV Park,"Shelby, MT",3314,1,TBD,50A,Yes,Yes,Yes,48.5240978,-111.8591962,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, June 16, 2024",Driving,195,George Lane Memorial Park,"High River, AB",3402,2,TBD,30A,No,No,Yes,50.5784315,-113.8751605,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, June 18, 2024",Driving,115,Tunnel Mountain Trailer Court,"Banff, AB",4717,10,343/236/143,50A,Yes,???,Yes,51.190485,-115.5344935,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, June 28, 2024",Driving,41,Lake Louise Tent Trailer CG,"Lake Louise, AB",5118,4,132,30A,No,No,Yes,51.4176144,-116.1734193,MDT (GMT-6),soft sided,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, July 02, 2024",Driving,144,Whistler's Campground,"Jasper, AB",3461,4,51O/51N/51D,50A,Yes,No,Yes,52.8504957,-118.0774499,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, July 06, 2024",Driving,249,Lakeview Aspen Beach PP,"Gull Lake, AB",2968,1,C-112,50A,DS,Yes,Yes,52.4622695,-113.9772208,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, July 07, 2024",Driving,255,Lethbridge KOA,"Lethbridge, AB",2715,1,TBD,50A,Yes,Yes,Yes,49.711501,-112.872927,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Monday, July 08, 2024",Driving,191,Big Sky Deli and Bakery,"Vaughn, MT",3500,1,n/a,No,No,No,No,47.5536727,-111.5612945,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Tuesday, July 09, 2024",Driving,287,7th Ranch RV Camp,"Garryowen, MT",3198,1,TBD,50A,Yes,No,No,45.4919436,-107.3776587,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Wednesday, July 10, 2024",Driving,215,Cedar Ridge RV Park,"Pine Haven, WY",4242,2,TBD,50A,Yes,Yes,Yes,44.3578215,-104.8174857,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, July 12, 2024",Driving,103,Buffalo Ridge Camp Resort,"Custer, SD",5312,8,TBD,50A,Yes,Yes,Yes,43.7584652,-103.6128112,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, July 20, 2024",Driving,178,Papa Moon Winery & Cider House,"Scottsbluff, NE",3888,1,n/a,Yes,No,No,No,41.8877158,-103.6176699,MDT (GMT-6),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, April 06, 2024",Diversion,162,Inn at the Park,"San Diego, CA",62,4,TBD,Yes,Yes,Yes,Yes,32.7385226,-117.1597926,PDT (GMT-7),,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437059592_10113157486872905_2897719270675615069_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bri3yQjEK0wQ7kNvgGMqqi1&_nc_ht=scontent-lax3-1.xx&oh=00_AYAnkP-mhdL78vB_27NQnfrXXFi4c94IhNLDbBj3bUBvWg&oe=66455A22,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436943997_10113157487326995_176877405778972645_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=KG8z-1AsrukQ7kNvgEx9rmI&_nc_ht=scontent-lax3-2.xx&oh=00_AYAQvmMICcSOTkUlvbapzZQtZ8gK0-kcQnGs3IZSteVBOg&oe=6644954C,Exploring San Diego,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436826410_10113157487277095_3202918927071770027_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=HgB8X16A9eMQ7kNvgEjskXq&_nc_ht=scontent-lax3-1.xx&oh=00_AYAOdbSZNXsjL6e_Vp9-1x4cHfumaOzC5zRzjULEwiCUbw&oe=6644A6E5,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436814227_10113157486917815_5226246387163188210_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qeNfk4nsGgoQ7kNvgE0lnIJ&_nc_oc=AdgLKC8oMZUKIZNntemK9IGuLyy8dza7QxyIgSwaVBvoPj5cPV8mb7-0Tk7sbFhJqLs&_nc_ht=scontent-lax3-2.xx&oh=00_AYCCpAjvXMgqW1zrIZfHws1MVauTtDytSQ4edXmPF16ang&oe=6644B23A,Balboa Park statues,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436848215_10113157486992665_126586897094099844_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xWjJ7VwkoVgQ7kNvgHM5ioR&_nc_ht=scontent-lax3-2.xx&oh=00_AYANSofACFhEu6hQHXxmPD2e86cYGh4ohK2oqcYAp4v2SA&oe=66455351,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437068525_10113157487391865_1395776972294009043_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=oJmi8zel7hYQ7kNvgHtF1rN&_nc_ht=scontent-lax3-2.xx&oh=00_AYD5_2eA5QdKqR73IPaz0VzHcs3pUhPxjyk_ORU7EbySaA&oe=66454CAD,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436855367_10113162570600075_6508114657532338430_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=dT_Uipk4IUQQ7kNvgEOK7uG&_nc_ht=scontent-lax3-2.xx&oh=00_AYBwmia5IZ5MZ65ZkCLHEylFLJIUNQID2abYf5Oiaub8dg&oe=66456168,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437121350_10113162570929415_3862895470608199557_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=CEEUr_-D3PgQ7kNvgFMAtQK&_nc_ht=scontent-lax3-2.xx&oh=00_AYDzCcFIfKYsl01ySn4kmEwblWGHGqAqAqRXgZC9etSunA&oe=664551F8,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436936386_10113162570674925_3773431542222534175_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Sf32fnO4ikQQ7kNvgHLY8mS&_nc_ht=scontent-lax3-1.xx&oh=00_AYCQo7hfJXWtvQ4qxMxWB7BS7QlUFEdt4BCzAGjsAHD54w&oe=66454C00,Hash House A Go Go,,,,,,,,,,,,,,
,Maple Canyon,,,"San Diego, CA",,,,,,,,32.7349759,-117.1638457,,,,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436800229_10113157487082485_8462202614202980015_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=aB0FI21__4MQ7kNvgEaTuOj&_nc_ht=scontent-lax3-1.xx&oh=00_AYA4daXl5Asuj0useGrsqq5HNn4ZPWTCMeQSPy_YSp3gpQ&oe=66455DBF,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436786595_10113157487182285_4093789804751709122_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Y9scPSFL0z8Q7kNvgF3JDQa&_nc_ht=scontent-lax3-1.xx&oh=00_AYBAJQv-KdAPUg6upO3QAhXVy5_tE7GRoha2J-hRiF3oaw&oe=664480BD,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,San Diego Zoo,,,"San Diego, CA",,,,,,,,32.7360353,-117.1509849,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436815461_10113162570106065_9169308069493340894_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XQaFbNTgJkQQ7kNvgH4TkuX&_nc_ht=scontent-lax3-2.xx&oh=00_AYDWwksJNolQ3d0CI05pznk5MNphO-m8v4H8sLSNO9pDYQ&oe=66455E03,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437048914_10113162570165945_5171242083195146354_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XLkJh4qHXEIQ7kNvgHb5seO&_nc_ht=scontent-lax3-1.xx&oh=00_AYBJsFbSmMRh_PkcutZfy8qu7xhd7GMCVQ9X-oalLLuzgQ&oe=6645691D,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/437039659_10113162570345585_2760437726411038176_n.jpg?stp=cp6_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Emne4eaB6cIQ7kNvgGvfkoZ&_nc_ht=scontent-lax3-1.xx&oh=00_AYDq7Gvn2ZqH0T2OrPZVsWv_nl7zkWSbhciUFbbrX5TLYQ&oe=664556A9,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437038675_10113162570440395_2404864818153854685_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=0pqvzdZlVjsQ7kNvgGGEbfw&_nc_ht=scontent-lax3-2.xx&oh=00_AYBtZbyXv8uoQfJ7UxpZ-izXCkeoH2QHs2M1yrnNOn3LmA&oe=66456FC2,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436936568_10113162570270735_5268868094972354584_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=WXuH7JAYPGEQ7kNvgHUpFe1&_nc_ht=scontent-lax3-2.xx&oh=00_AYDY2xBU5aY7etKLCq1WAaHGmXk0z1ImALpF4wafgXGYQQ&oe=66455C01,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436788236_10113162570520235_5186407492941795472_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=RyiAfCjvRXkQ7kNvgE7XCTY&_nc_ht=scontent-lax3-2.xx&oh=00_AYDMhzNDbaMbc78T8y5oBPqqhCjNdQFmb_ryFI3zdnFVsQ&oe=66456FF4,-,,,,,,,,,,,,,,,,,,,,
,Padres Game,,Petco Park,"San Diego, CA",,,,,,,,32.7075941,-117.1570422,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436961662_10113162570774725_2263685220050761198_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2yKgF-XmtPYQ7kNvgFzsKQV&_nc_ht=scontent-lax3-2.xx&oh=00_AYDH3wg2QRQRtZWwL8pSNvCr5jz1PnFUs-Xppn2s9j4sdw&oe=66454AB0,-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,San Diego Natural History Museum,,,"San Diego, CA",,,,,,,,32.7323223,-117.147364,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Fleet Science Center ,,,"San Diego, CA",,,,,,,,32.7308009,-117.1469593,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Waterfront Park,,,"San Diego, CA",,,,,,,,32.722281,-117.172761,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Coronado Ferry Landing Park,,,"San Diego, CA",,,,,,,,32.698986,-117.1693818,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436907584_10113162571213845_7938910756167085226_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C6Dfz0BEYdMQ7kNvgGrccWa&_nc_ht=scontent-lax3-2.xx&oh=00_AYB4d_i6VKOtkS4XAoLh4pwc5KXe72sGbDQjBZKfYFQ_EQ&oe=6645715E,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436917671_10113162571852565_9133109319539643042_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2mFMsl3XsIQQ7kNvgEC_lAR&_nc_ht=scontent-lax3-2.xx&oh=00_AYDqTBNRRI6gqoyvNYiJW2EGP5U_oITfwyZTAg6Lh8oRhw&oe=66455522,-,https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/436897424_10113162571039195_2116330877988086408_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=BDALibigaaEQ7kNvgFIHZ2B&_nc_ht=scontent-lax3-1.xx&oh=00_AYDcPAgT7pUjCtYOtToUD_bjq2RKvS5CFlfecO1gPGjqgQ&oe=6645535A,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436944315_10113162571134005_3768073066702433097_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qFp-UycwS7YQ7kNvgFYVYHw&_nc_ht=scontent-lax3-2.xx&oh=00_AYA0od89HcMD4vEaahld5Sw4IeQflAvbRLboyk8SaybN8A&oe=66454B37,-,,,,,,,,,,,,,,,,,,,,,,,,
,Seal Point,,La Jolla,"San Diego, CA",,,,,,,,32.8469916,-117.2786487,,,,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437054042_10113162571498275_620121363306425967_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=X1jPChYo9JcQ7kNvgEhr446&_nc_ht=scontent-lax3-2.xx&oh=00_AYCmrWuqqZVCdW6Q1y5oy7PlqyoJ28qInpUC7jDNo0utzg&oe=664573C0,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436953452_10113162571642985_1544488790235333555_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=-okr6KCxI10Q7kNvgGuabff&_nc_ht=scontent-lax3-2.xx&oh=00_AYCoX0x6dPjO6FwHyhnK-Yo4R98kucSgraPOVUT4y9FpXg&oe=664566AB,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436785928_10113162571363545_1106142565590606288_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=5O8sPYzDdcYQ7kNvgHX2ELJ&_nc_ht=scontent-lax3-2.xx&oh=00_AYCMlYdXDEmOkRIz6WE_YABUajVphBuG7DpgdgO10NWSFA&oe=6645793B,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/437134345_10113162571782705_4460695709672898279_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=nHjg9sMSPEAQ7kNvgGFVeG3&_nc_ht=scontent-lax3-2.xx&oh=00_AYDjfP0G3jnMb6KGNt_dCnxvm6MwmqWC3mbjb0Hq5s_NoQ&oe=66457791,-,https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-6/436817559_10113162571288695_6713206866135415426_n.jpg?stp=cp6_dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=g4-RZdzmOBkQ7kNvgF8C_oz&_nc_ht=scontent-lax3-2.xx&oh=00_AYDPHcwKsASLErfhQqbP-ErcOtAY-aDPjiuENzGrI5bQ7A&oe=6645526B,-,,,,,,,,,,,,,,,,,,,,,,
,First Saturday Swing,,Infinity Dance,"San Diego, CA",,,,,,,,32.8267967,-117.1608955,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Monday, April 29, 2024",Diversion,274,Luxor Hotel & Casino,"Las Vegas, NV",2001,1,TBD,Yes,Yes,Yes,Yes,36.09551,-115.1760672,PDT (GMT-7),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Pick Up Nanny and Papa,,Harry Reid International Airport,"Las Vegas, NV",,,,,,,,36.0830907,-115.1482238,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, May 5, 2024",Diversion,156,Paris Las Vegas,"Las Vegas, NV",2001,2,TBD,Yes,Yes,Yes,Yes,36.112462,-115.1707075,PDT (GMT-7),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Drop Off Nanny and Papa,,Harry Reid International Airport,"Las Vegas, NV",,,,,,,,36.086905,-115.136464,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Sunday, May 5, 2024",Jersey Boys,,Orleans Showroom,"Las Vegas, NV",,,,,,,,36.1022222,-115.2011111,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, May 24, 2024",Diversion,210,Ogden AirBnB,"Ogden, UT",4300,3,n/a,Yes,Yes,Yes,Yes,41.2209588,-111.9739393,MDT (GMT-6),272 25th Street,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Saturday, June 15, 2024",Diversion,27,Tonya to Dance Camp,"Bozeman, MT",4473,0,n/a,Yes,Yes,Yes,Yes,45.7784043,-111.1612273,MDT (GMT-6),,Bozeman airport,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Friday, June 21, 2024",Diversion,90,Tonya Returns!,"Calgary, AB",3428,0,n/a,Yes,Yes,Yes,Yes,51.1325928,-114.0138904,MDT (GMT-6),,Calgary airport,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  `.split('\n').filter(s => s.trim() !== '');
  const tripDataHeaders = tripDataRaw[0].split(',').map(s => s.trim());
  tripDataRaw = tripDataRaw.slice(1);
  let lastType = undefined;
  const tripData = {
    tripData: [],
    diversions: [],
    pointsOfInterest: [],
  }
  tripDataRaw.map((s, i) => {
    let arr = s.split(",").map(s => s.trim());
    let checkMerge = true;
    while (checkMerge) {
      let i = 0;
      while (i < arr.length - 1) {
        i = parseInt(i);
        const s = arr[i];
        if (s[0] === '"' && s[s.length - 1] !== '"') {
          arr = arr.slice(0, i).concat([arr[i] + ', ' + arr[i + 1]]).concat(arr.slice(i + 2));
          continue
        } else {
          i += 1;

        }
      }
      checkMerge = false;
    }
    let obj = Object({});
    for (const i in arr) {
      const hdr = tripDataHeaders[i];
      if (hdr === 'imageSrcs') {
        let imgSrcs = arr.slice(i).filter(s => s.trim() !== '');
        let images = [];
        while (imgSrcs.length > 0) {
          images.push({
            src: imgSrcs[0],
            caption: imgSrcs[1]
          })
          imgSrcs = imgSrcs.slice(2);
        }
        obj.images = images;
        continue
      }
      let s = arr[i];
      if (s[0] === '"'){
        s = s.slice(1);
      }
      if (s[s.length -1 ] === '"') {
        s = s.slice(0, s.length - 1)
      }
      if (["miles", "elevation", "lat", "lng", "nights"].includes(hdr)) {
        obj[tripDataHeaders[i]] = parseFloat(s);
      } else if (hdr === "date") {
        obj[tripDataHeaders[i]] = new Date(s);
      } else {
        obj[tripDataHeaders[i]] = s;
      }
    }
    if (obj.activity.toLowerCase() === 'driving') {
      obj.pointsOfInterest = [];
      obj.placeType = 'campground';
      tripData.tripData.push(obj);
      lastType = 'campground';
    } else if (obj.activity.toLowerCase() === 'diversion') {
      obj.pointsOfInterest = [];
      obj.placeType = 'diversion';
      tripData.diversions.push(obj);
      lastType = 'diversion';
    } else {
      obj.parentType = lastType;
      const k = lastType === 'campground' ? 'tripData' : 'diversions'
      const parent = tripData[k][tripData[k].length - 1]
      obj.parentName = parent.campground;
      obj.parentInd = tripData[k].length - 1;
      tripData.pointsOfInterest.push(obj);
      tripData[k][tripData[k].length - 1].pointsOfInterest.push(tripData.pointsOfInterest.length - 1);
      obj.desc = '';
      if (obj.activity !== '') {
        obj.desc = obj.activity;
        if (obj.campground !== '') {
          obj.desc += (
            ' (' + obj.campground + (
              obj.city === '' ? '' : (', ' + obj.city) 
            ) + ')'
          )
        } else if (obj.city !== '') {
          obj.desc += (' (' + obj.city + ')');
        }
      } else if (obj.campground !== '') {
        obj.desc = obj.campground;
        if (obj.city !== '') {
          obj.desc += (' (' + obj.city + ')');
        }
      } else {
        obj.desc = obj.city;
      }
    }
  });
  for (const i in tripData.diversions) {
    const iInt = parseInt(i);
    const d = tripData.diversions[iInt];
    d.dataInd = iInt;
    let campgroundInd = 0;
    for (const td of tripData.tripData) {
      if (new Date(d.date) > new Date(td.date)) {
        campgroundInd += 1;
      } else {
        break;
      }
    }
    d.fromCampgroundInd = campgroundInd - 1;
    let leaveDate = new Date(d.date);
    leaveDate.setDate(leaveDate.getDate() + d.nights);
    d.leaveDate = leaveDate;
    while (campgroundInd < tripData.tripData.length - 1) {
      if (leaveDate >= new Date(tripData.tripData[campgroundInd].date)) {
        campgroundInd += 1;
      } else {
        break;
      }
    }
    d.toCampgroundInd = campgroundInd - 1;
  }
  for (const i in tripData.tripData) {
    const iInt = parseInt(i);
    tripData.tripData[iInt].dataInd = iInt;
    tripData.tripData[iInt].fromCampgroundInd = iInt - 1;
    tripData.tripData[iInt].toCampgroundInd = iInt + 1;
  }
  
  const allPlacesData = tripData.tripData.concat(tripData.diversions).sort((a, b) => {
    return a.date - b.date + (b.placeType === 'campground' ? 1 : 0) - (a.placeType === 'campground' ? 1 : 0)
  });
  let tdInd = 0;
  let dvInd = 0;
  for (const apd in allPlacesData) {
    if (allPlacesData[apd].placeType === 'campground') {
      tripData.tripData[tdInd].allPlacesInd = parseInt(apd);
      tdInd += 1;
    } else {
      tripData.diversions[dvInd].allPlacesInd = parseInt(apd);
      dvInd += 1;
    }
  }
  tripData.allPlacesData = allPlacesData;
  return tripData
};

const tData = getTripData();
const tripData = readable(tData.tripData);
const diversionData = readable(tData.diversions);
const pointOfInterestData = readable(tData.pointsOfInterest);
const allPlacesData = readable(tData.allPlacesData);

const getDateData = (d) => {
  let currentInd = -1;
  const dt = new Date(d);
  for (const td of get(tripData)) {
    if (td.date < dt) {
      currentInd += 1;
    }
  }
  if (
    currentInd > 0 &&
    get(tripData)[currentInd].date.toDateString() == dt.toDateString()
  ) {
    return [get(tripData)[currentInd - 1], get(tripData)[currentInd]];
  } else {
    return [get(tripData)[currentInd]];
  }
};

const tripWeatherData = writable([]);
const hourlyWeatherData = writable([]);

const getWeatherData = async () => {
  const today = dayjs(new Date());
  let loopDay = dayjs(new Date());

  let allDateWeatherInfo = [];
  let allHourlyWeatherInfo = [];

  const getWeatherData = async (lat, lng, dt) => {
    dt = new Date(dt);
    let nowData = [];
    let nowHourlyData = [];
    const latLngDtData = async (lat, lng, dt) => {
      const response = await fetch(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      const myJson = await response.json();
      const hourlyResponse = await fetch(myJson.properties.forecastHourly);
      const hourlyJson = await hourlyResponse.json();
      const periods = (hourlyJson.properties || {periods: []}).periods;
      nowHourlyData = periods;
      if (dt.toDateString() == new Date(today).toDateString()) {
        periods[0].name = "Now";
        nowData = [periods[0]];
      }
      const forecastResponse = await fetch(myJson.properties.forecast);
      const forecastJson = await forecastResponse.json();
      const fcstPeriods = forecastJson.properties.periods;
      const filtered = fcstPeriods.filter(
        (p) => new Date(p.startTime).toDateString() == dt.toDateString()
      );
      nowData = nowData.concat(filtered);
      return [nowData, nowHourlyData];
    }
    try {
      return latLngDtData(lat, lng, dt);
    } catch {
      try {
        return latLngDtData(lat, lng, dt);
      } catch {
        try {
          return latLngDtData(lat, lng, dt);
        } catch {
          return [[undefined], [undefined]];
        }
      }
    }
  };

  let lastHourlyInd = -1;
  while (loopDay < today.add(7, "day")) {
    const allDateInfo = getDateData(loopDay);
    for (const dateInfo of allDateInfo) {
      dateInfo.actualDay = loopDay;
      let [newWeatherData, newHourlyWeatherData] = await getWeatherData(
        dateInfo.lat,
        dateInfo.lng,
        loopDay
      );
      newWeatherData = newWeatherData.map((wd) => {
        wd.travelData = dateInfo;
        return wd;
      });
      allDateWeatherInfo = allDateWeatherInfo.concat(newWeatherData);
      const hourlyInd = (dateInfo || {dataInd: lastHourlyInd}).dataInd;
      if (lastHourlyInd !== hourlyInd) {
        lastHourlyInd = dateInfo.dataInd;
        newHourlyWeatherData = newHourlyWeatherData.filter((wd) => {
          return dayjs(wd.startTime) < dayjs(dateInfo.date).add(dateInfo.nights, 'day').add(12, 'hour')
        }).filter((wd) => {
          return dayjs(wd.startTime) >= dayjs(dateInfo.date).add(12, 'hour')
        })
        newHourlyWeatherData = newHourlyWeatherData.map((wd) => {
          wd.travelData = dateInfo;
          return wd;
        });
        allHourlyWeatherInfo = allHourlyWeatherInfo.concat(newHourlyWeatherData);
      }
    }
    loopDay = loopDay.add(1, "day");
  }
  for (let i in allDateWeatherInfo) {
    i = parseInt(i);
    allDateWeatherInfo[i].isNewLocation = false;
    if (
      i === 0 ||
      allDateWeatherInfo[i].travelData.campground !==
        allDateWeatherInfo[i - 1].travelData.campground
    ) {
      allDateWeatherInfo[i].isNewLocation = true;
    }
  }
  tripWeatherData.set(allDateWeatherInfo); 
  for (let i in allHourlyWeatherInfo) {
    i = parseInt(i);
    allHourlyWeatherInfo[i].isNewLocation = false;
    allHourlyWeatherInfo[i].isNewDay = false;
    if (
      i === 0 ||
      allHourlyWeatherInfo[i].travelData.campground !==
        allHourlyWeatherInfo[i - 1].travelData.campground
    ) {
      allHourlyWeatherInfo[i].isNewLocation = true;
    }
    if (i === 0 || new Date(allHourlyWeatherInfo[i].startTime).getDate() !== new Date(allHourlyWeatherInfo[i - 1].startTime).getDate()) {
      allHourlyWeatherInfo[i].isNewDay = true;
    }
  }
  hourlyWeatherData.set(allHourlyWeatherInfo);
};

getWeatherData();

export { tripData, diversionData, pointOfInterestData, getDateData, tripWeatherData, hourlyWeatherData, allPlacesData };
