export function mapPerson(person){
    const {name, age} = JSON.parse(person)

    return{
        name,
        age,
        createdAt: new Date()
    }
}