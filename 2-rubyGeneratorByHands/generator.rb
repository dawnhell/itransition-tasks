def openLocaleFile fileName
  data={}
  i=0
  File.readlines(fileName).map do |line|
    arr=line.to_s.gsub("\n", "").gsub("\r", "")
    data[i]=arr
    i=i+1
  end
  return data
end

locale=ARGV[0]
counter=ARGV[1].to_i
mistakeChance=ARGV[2] ? (ARGV[2].to_f >= 0 ? ARGV[2].to_f : (raise 'Number of mistakes must be positive.')) : 0
mistakeNumber=mistakeChance*counter
remainder=mistakeNumber%counter
timesNumber=(mistakeNumber/counter).to_i

if locale=="ru_RU"
  country="Россия"
  $addPrefix=", д."
elsif locale=="by_BY"
  country="Беларусь"
  $addPrefix=", д."
elsif locale=="en_US"
  country="Unates States"
  $addPrefix=", fl."
elsif locale=="en_GB"
 country="Great Britain"
 $addPrefix=", h."
end

$states=openLocaleFile("locale/"+locale+"/states.yml")
$cities=openLocaleFile("locale/"+locale+"/cities.yml")
$streets=openLocaleFile("locale/"+locale+"/streets.yml")
$firstname_m=openLocaleFile("locale/"+locale+"/firstname_m.yml")
$firstname_f=openLocaleFile("locale/"+locale+"/firstname_f.yml")
$lastname_m=openLocaleFile("locale/"+locale+"/lastname_m.yml")
$lastname_f=openLocaleFile("locale/"+locale+"/lastname_f.yml")
$phones=openLocaleFile("locale/"+locale+"/phones.yml")
if !File.file?("locale/"+locale+"/middlename_m.yml") || !File.file?("locale/"+locale+"/middlename_f.yml")
  $middlename_m=""
  $middlename_f=""
else
  $middlename_m=openLocaleFile("locale/"+locale+"/middlename_m.yml")
  $middlename_f=openLocaleFile("locale/"+locale+"/middlename_f.yml")
end

def mistakeString str
  #Uncomment to check the correctness of making mistakes
  #puts str + " -- mistake here"
  cc=Random.rand(2)
  case cc
    when 0
      letter1=Random.rand(str.length)
      letter2=Random.rand(str.length)
      temp=str[letter1]
      str[letter1]=str[letter2]
      str[letter2]=temp
    when 1
      str[Random.rand(str.length)+1]=''
  end

  return str
end

def chooseMistake name, state, city, street, phone
  c=Random.rand(5)
  case c
    when 0
      name=mistakeString(name)
    when 1
      state=mistakeString(state)
    when 2
      city=mistakeString(city)
    when 3
      street=mistakeString(street)
    when 4
      phone=mistakeString(phone)
  end
end

def chooseName
  c=Random.rand(2)
  case c
    when 0
      name=$lastname_m[Random.rand($lastname_m.size)] + " " + $firstname_m[Random.rand($firstname_m.size)] + ($middlename_m.size>0 ? " " + $middlename_m[Random.rand($middlename_m.size)] : "")
    when 1
      name=$lastname_f[Random.rand($lastname_f.size)] + " " + $firstname_f[Random.rand($firstname_f.size)] + ($middlename_f.size>0 ? " " + $middlename_f[Random.rand($middlename_f.size)] : "")
  end
  return name
end

def chooseState
  state=$states[Random.rand($states.size)]
  return state
end

def chooseCity
  city=$cities[Random.rand($cities.size)]
  return city
end

def chooseStreet
  street=$streets[Random.rand($streets.size)] + $addPrefix + Random.rand(500).to_s
  return street
end

def choosePhone
  phone=$phones[Random.rand($phones.size)] + Random.rand(1000).to_s
  return phone
end

counter.times do |i|
  name=chooseName
  state=chooseState
  city=chooseCity
  street=chooseStreet
  phone=choosePhone

  if(mistakeNumber >= counter)
    timesNumber.to_i.times do
      chooseMistake(name, state, city, street, phone)
    end
    if(remainder>0)
      chooseMistake(name, state, city, street, phone)
      remainder=remainder-1
    end
  else
    if(i<mistakeNumber)
      chooseMistake(name, state, city, street, phone)
    end
  end

  puts name + "; " + country + "; " + state + "; " + city + "; " + street + "; " + phone
end