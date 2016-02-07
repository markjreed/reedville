load("cindu.js")
cd = new CinduDate()
for (var i=cd.lero; i>=0; --i)
{
    cd.lero = i
    cd.setFromLero()
    cd.setLero()
    if (cd.lero != i)
    {
        print("Round-trip failure at lero " + i);
    }
    cd.tomorrow()
    if (cd.lero != i + 1)
    {
        print("Tomorrow() failure at lero " + i)
    }
    cd.yesterday()
    if (cd.lero != i)
    {
        print("Yesterday() failure at lero " + i + 1)
    }
}
