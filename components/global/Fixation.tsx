import { ArrowUpIcon } from '@modulz/radix-icons'
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Transition } from '@mantine/core';

function Fixation() {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<ArrowUpIcon />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                           回到顶部
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}

export default Fixation;
